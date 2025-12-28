
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface BudgetExpense {
  id: string;
  user_id: string;
  budget_id: string;
  name: string;
  amount: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  month: string;
  total_amount: number;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
  expenses?: BudgetExpense[];
}

interface BudgetContextType {
  budgets: Budget[];
  loading: boolean;
  addBudget: (month: string, totalAmount: number) => Promise<void>;
  updateBudget: (id: string, updates: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  addExpense: (budgetId: string, name: string, amount: number) => Promise<void>;
  updateExpense: (id: string, updates: Partial<BudgetExpense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  toggleBudgetPin: (id: string) => Promise<void>;
  toggleExpensePin: (id: string) => Promise<void>;
  refreshBudgets: () => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      refreshBudgets();
    } else {
      setBudgets([]);
      setLoading(false);
    }
  }, [user]);

  const refreshBudgets = async () => {
    if (!user) {
      console.log('No user, skipping budget refresh');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching budgets for user:', user.id);
      
      // Fetch budgets
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('user_budgets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (budgetsError) {
        console.error('Error fetching budgets:', budgetsError);
        throw budgetsError;
      }

      // Fetch expenses for each budget
      const { data: expensesData, error: expensesError } = await supabase
        .from('user_expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (expensesError) {
        console.error('Error fetching expenses:', expensesError);
        throw expensesError;
      }

      // Combine budgets with their expenses
      const budgetsWithExpenses = (budgetsData || []).map(budget => ({
        ...budget,
        expenses: (expensesData || []).filter(expense => expense.budget_id === budget.id),
      }));

      console.log('Fetched budgets with expenses:', budgetsWithExpenses);
      setBudgets(budgetsWithExpenses);
    } catch (error) {
      console.error('Error in refreshBudgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBudget = async (month: string, totalAmount: number) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      console.log('Adding budget:', { month, totalAmount });
      
      const { data, error } = await supabase
        .from('user_budgets')
        .insert([
          {
            user_id: user.id,
            month,
            total_amount: totalAmount,
            is_pinned: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding budget:', error);
        throw error;
      }

      console.log('Added budget:', data);
      await refreshBudgets();
    } catch (error) {
      console.error('Error in addBudget:', error);
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      console.log('Updating budget:', id, updates);
      
      const { error } = await supabase
        .from('user_budgets')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating budget:', error);
        throw error;
      }

      console.log('Updated budget successfully');
      await refreshBudgets();
    } catch (error) {
      console.error('Error in updateBudget:', error);
    }
  };

  const deleteBudget = async (id: string) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      console.log('Deleting budget:', id);
      
      // First delete all expenses for this budget
      const { error: expensesError } = await supabase
        .from('user_expenses')
        .delete()
        .eq('budget_id', id)
        .eq('user_id', user.id);

      if (expensesError) {
        console.error('Error deleting expenses:', expensesError);
        throw expensesError;
      }

      // Then delete the budget
      const { error } = await supabase
        .from('user_budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting budget:', error);
        throw error;
      }

      console.log('Deleted budget successfully');
      await refreshBudgets();
    } catch (error) {
      console.error('Error in deleteBudget:', error);
    }
  };

  const addExpense = async (budgetId: string, name: string, amount: number) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      console.log('Adding expense:', { budgetId, name, amount });
      
      const { data, error } = await supabase
        .from('user_expenses')
        .insert([
          {
            user_id: user.id,
            budget_id: budgetId,
            name,
            amount,
            is_pinned: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding expense:', error);
        throw error;
      }

      console.log('Added expense:', data);
      await refreshBudgets();
    } catch (error) {
      console.error('Error in addExpense:', error);
    }
  };

  const updateExpense = async (id: string, updates: Partial<BudgetExpense>) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      console.log('Updating expense:', id, updates);
      
      const { error } = await supabase
        .from('user_expenses')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating expense:', error);
        throw error;
      }

      console.log('Updated expense successfully');
      await refreshBudgets();
    } catch (error) {
      console.error('Error in updateExpense:', error);
    }
  };

  const deleteExpense = async (id: string) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      console.log('Deleting expense:', id);
      
      const { error } = await supabase
        .from('user_expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting expense:', error);
        throw error;
      }

      console.log('Deleted expense successfully');
      await refreshBudgets();
    } catch (error) {
      console.error('Error in deleteExpense:', error);
    }
  };

  const toggleBudgetPin = async (id: string) => {
    const budget = budgets.find(b => b.id === id);
    if (!budget) {
      console.error('Budget not found:', id);
      return;
    }

    await updateBudget(id, { is_pinned: !budget.is_pinned });
  };

  const toggleExpensePin = async (id: string) => {
    // Find the expense across all budgets
    let expense: BudgetExpense | undefined;
    for (const budget of budgets) {
      expense = budget.expenses?.find(e => e.id === id);
      if (expense) break;
    }

    if (!expense) {
      console.error('Expense not found:', id);
      return;
    }

    await updateExpense(id, { is_pinned: !expense.is_pinned });
  };

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        loading,
        addBudget,
        updateBudget,
        deleteBudget,
        addExpense,
        updateExpense,
        deleteExpense,
        toggleBudgetPin,
        toggleExpensePin,
        refreshBudgets,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgets() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgets must be used within a BudgetProvider');
  }
  return context;
}
