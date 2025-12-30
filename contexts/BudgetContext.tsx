
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

const DEFAULT_MONTHS: MonthData[] = [
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
];

export function BudgetProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [months, setMonthsState] = useState<MonthData[]>(DEFAULT_MONTHS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadFromSupabase().catch(error => {
        console.error('Error loading budget data:', error);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && months.length > 0) {
      const timeoutId = setTimeout(() => {
        syncToSupabase().catch(error => {
          console.error('Error syncing budget data:', error);
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [months, user]);

  const loadFromSupabase = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: budgetsData, error: budgetsError } = await supabase
        .from('user_budgets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (budgetsError) throw budgetsError;
      if (!budgetsData || budgetsData.length === 0) return;

      const { data: expensesData, error: expensesError } = await supabase
        .from('user_expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (expensesError) throw expensesError;

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

      setMonthsState(loadedMonths);
    } catch (error) {
      console.error('Exception loading budget data:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncToSupabase = async () => {
    if (!user) return;

    try {
      for (const month of months) {
        await supabase
          .from('user_budgets')
          .upsert({
            id: month.id,
            user_id: user.id,
            month: month.name,
            total_amount: month.accountBalance,
            is_pinned: month.isPinned,
            updated_at: new Date().toISOString(),
          });

        for (const item of month.budgetItems) {
          await supabase
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
        }

        if (month.budgetItems.length > 0) {
          const expenseIds = month.budgetItems.map(item => item.id);
          await supabase
            .from('user_expenses')
            .delete()
            .eq('budget_id', month.id)
            .not('id', 'in', `(${expenseIds.join(',')})`);
        } else {
          await supabase
            .from('user_expenses')
            .delete()
            .eq('budget_id', month.id);
        }
      }

      if (months.length > 0) {
        const monthIds = months.map(m => m.id);
        await supabase
          .from('user_budgets')
          .delete()
          .eq('user_id', user.id)
          .not('id', 'in', `(${monthIds.join(',')})`);
      }
    } catch (error) {
      console.error('Exception syncing budget data:', error);
    }
  };

  const setMonths = (newMonths: MonthData[]) => {
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
