
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
  isPinned: boolean;
}

export interface MonthData {
  id: string;
  name: string;
  isPinned: boolean;
  budgetItems: BudgetItem[];
  accountBalance: number;
}

interface BudgetContextType {
  months: MonthData[];
  setMonths: (months: MonthData[]) => void;
  loading: boolean;
  syncToSupabase: () => Promise<void>;
  loadFromSupabase: () => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [months, setMonthsState] = useState<MonthData[]>([
    {
      id: '1',
      name: 'DEZEMBER',
      isPinned: false,
      accountBalance: 13556,
      budgetItems: [
        { id: '1', name: 'SPAREN', amount: 1500, isPinned: false },
        { id: '2', name: 'KRANKEN KASSE', amount: 450, isPinned: false },
        { id: '3', name: 'ESSEN', amount: 650, isPinned: false },
        { id: '4', name: 'MIETE', amount: 2500, isPinned: false },
        { id: '5', name: 'SPAREN', amount: 1146, isPinned: false },
        { id: '6', name: 'SPAREN', amount: 1146, isPinned: false },
      ],
    },
  ]);
  const [loading, setLoading] = useState(false);

  // Load data from Supabase when user logs in
  useEffect(() => {
    if (user) {
      console.log('BudgetContext: User logged in, loading budget data from Supabase');
      loadFromSupabase().catch(error => {
        console.error('BudgetContext: Error loading data:', error);
      });
    }
  }, [user]);

  // Auto-sync to Supabase whenever months change (debounced)
  useEffect(() => {
    if (user && months.length > 0) {
      const timeoutId = setTimeout(() => {
        console.log('BudgetContext: Auto-syncing budget data to Supabase');
        syncToSupabase().catch(error => {
          console.error('BudgetContext: Error syncing data:', error);
        });
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [months, user]);

  const loadFromSupabase = async () => {
    if (!user) {
      console.log('BudgetContext: No user, skipping Supabase load');
      return;
    }

    try {
      setLoading(true);
      console.log('BudgetContext: Loading budget data from Supabase for user:', user.id);

      // Load months
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('user_budgets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (budgetsError) {
        console.error('BudgetContext: Error loading budgets:', budgetsError);
        throw budgetsError;
      }

      if (!budgetsData || budgetsData.length === 0) {
        console.log('BudgetContext: No budget data found in Supabase, keeping default data');
        return;
      }

      // Load expenses for all months
      const { data: expensesData, error: expensesError } = await supabase
        .from('user_expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (expensesError) {
        console.error('BudgetContext: Error loading expenses:', expensesError);
        throw expensesError;
      }

      // Combine data
      const loadedMonths: MonthData[] = budgetsData.map(budget => ({
        id: budget.id,
        name: budget.month,
        isPinned: budget.is_pinned || false,
        accountBalance: parseFloat(budget.total_amount?.toString() || '0'),
        budgetItems: (expensesData || [])
          .filter(expense => expense.budget_id === budget.id)
          .map(expense => ({
            id: expense.id,
            name: expense.name,
            amount: parseFloat(expense.amount.toString()),
            isPinned: expense.is_pinned || false,
          })),
      }));

      console.log('BudgetContext: Successfully loaded', loadedMonths.length, 'months from Supabase');
      setMonthsState(loadedMonths);
    } catch (error) {
      console.error('BudgetContext: Exception loading budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncToSupabase = async () => {
    if (!user) {
      console.log('BudgetContext: No user, skipping Supabase sync');
      return;
    }

    try {
      console.log('BudgetContext: Syncing', months.length, 'months to Supabase for user:', user.id);

      // Sync months
      for (const month of months) {
        const { error: budgetError } = await supabase
          .from('user_budgets')
          .upsert({
            id: month.id,
            user_id: user.id,
            month: month.name,
            total_amount: month.accountBalance,
            is_pinned: month.isPinned,
            updated_at: new Date().toISOString(),
          });

        if (budgetError) {
          console.error('BudgetContext: Error syncing budget:', month.id, budgetError);
          continue;
        }

        // Sync expenses for this month
        for (const item of month.budgetItems) {
          const { error: expenseError } = await supabase
            .from('user_expenses')
            .upsert({
              id: item.id,
              user_id: user.id,
              budget_id: month.id,
              name: item.name,
              amount: item.amount,
              is_pinned: item.isPinned,
              updated_at: new Date().toISOString(),
            });

          if (expenseError) {
            console.error('BudgetContext: Error syncing expense:', item.id, expenseError);
          }
        }

        // Delete expenses that are no longer in the month
        if (month.budgetItems.length > 0) {
          const expenseIds = month.budgetItems.map(item => item.id);
          const { error: deleteError } = await supabase
            .from('user_expenses')
            .delete()
            .eq('budget_id', month.id)
            .not('id', 'in', `(${expenseIds.join(',')})`);

          if (deleteError) {
            console.error('BudgetContext: Error deleting old expenses:', deleteError);
          }
        } else {
          // If no expenses, delete all for this month
          const { error: deleteAllError } = await supabase
            .from('user_expenses')
            .delete()
            .eq('budget_id', month.id);

          if (deleteAllError) {
            console.error('BudgetContext: Error deleting all expenses for month:', deleteAllError);
          }
        }
      }

      // Delete months that are no longer in the list
      if (months.length > 0) {
        const monthIds = months.map(m => m.id);
        const { error: deleteMonthsError } = await supabase
          .from('user_budgets')
          .delete()
          .eq('user_id', user.id)
          .not('id', 'in', `(${monthIds.join(',')})`);

        if (deleteMonthsError) {
          console.error('BudgetContext: Error deleting old months:', deleteMonthsError);
        }
      }

      console.log('BudgetContext: Successfully synced all budget data to Supabase');
    } catch (error) {
      console.error('BudgetContext: Exception syncing budget data:', error);
    }
  };

  const setMonths = (newMonths: MonthData[]) => {
    console.log('BudgetContext: Setting months:', newMonths.length);
    setMonthsState(newMonths);
  };

  return (
    <BudgetContext.Provider
      value={{
        months,
        setMonths,
        loading,
        syncToSupabase,
        loadFromSupabase,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}
