
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface Subscription {
  id: string;
  user_id: string;
  name: string;
  amount: number;
  billing_cycle: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  loading: boolean;
  addSubscription: (name: string, amount: number, billingCycle: string) => Promise<void>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<void>;
  deleteSubscription: (id: string) => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  refreshSubscriptions: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      refreshSubscriptions();
    } else {
      setSubscriptions([]);
      setLoading(false);
    }
  }, [user]);

  const refreshSubscriptions = async () => {
    if (!user) {
      console.log('No user, skipping subscription refresh');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching subscriptions for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subscriptions:', error);
        throw error;
      }

      console.log('Fetched subscriptions:', data);
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error in refreshSubscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSubscription = async (name: string, amount: number, billingCycle: string = 'monthly') => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      console.log('Adding subscription:', { name, amount, billingCycle });
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert([
          {
            user_id: user.id,
            name,
            amount,
            billing_cycle: billingCycle,
            is_pinned: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('Error adding subscription:', error);
        throw error;
      }

      console.log('Added subscription:', data);
      await refreshSubscriptions();
    } catch (error) {
      console.error('Error in addSubscription:', error);
    }
  };

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      console.log('Updating subscription:', id, updates);
      
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating subscription:', error);
        throw error;
      }

      console.log('Updated subscription successfully');
      await refreshSubscriptions();
    } catch (error) {
      console.error('Error in updateSubscription:', error);
    }
  };

  const deleteSubscription = async (id: string) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      console.log('Deleting subscription:', id);
      
      const { error } = await supabase
        .from('user_subscriptions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting subscription:', error);
        throw error;
      }

      console.log('Deleted subscription successfully');
      await refreshSubscriptions();
    } catch (error) {
      console.error('Error in deleteSubscription:', error);
    }
  };

  const togglePin = async (id: string) => {
    const subscription = subscriptions.find(s => s.id === id);
    if (!subscription) {
      console.error('Subscription not found:', id);
      return;
    }

    await updateSubscription(id, { is_pinned: !subscription.is_pinned });
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        loading,
        addSubscription,
        updateSubscription,
        deleteSubscription,
        togglePin,
        refreshSubscriptions,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
}
