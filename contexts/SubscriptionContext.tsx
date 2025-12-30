
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  isPinned: boolean;
  billingCycle?: string;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  setSubscriptions: (subscriptions: Subscription[]) => void;
  loading: boolean;
  syncToSupabase: () => Promise<void>;
  loadFromSupabase: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subscriptions, setSubscriptionsState] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadFromSupabase().catch(error => {
        console.error('Error loading subscription data:', error);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && subscriptions.length >= 0) {
      const timeoutId = setTimeout(() => {
        syncToSupabase().catch(error => {
          console.error('Error syncing subscription data:', error);
        });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [subscriptions, user]);

  const loadFromSupabase = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        setSubscriptionsState([]);
        return;
      }

      const loadedSubscriptions: Subscription[] = data.map(sub => ({
        id: sub.id,
        name: sub.name,
        amount: parseFloat(sub.amount.toString()),
        isPinned: sub.is_pinned || false,
        billingCycle: sub.billing_cycle || 'monthly',
      }));

      setSubscriptionsState(loadedSubscriptions);
    } catch (error) {
      console.error('Exception loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const syncToSupabase = async () => {
    if (!user) return;

    try {
      for (const subscription of subscriptions) {
        await supabase
          .from('user_subscriptions')
          .upsert({
            id: subscription.id,
            user_id: user.id,
            name: subscription.name,
            amount: subscription.amount,
            billing_cycle: subscription.billingCycle || 'monthly',
            is_pinned: subscription.isPinned,
            updated_at: new Date().toISOString(),
          });
      }

      if (subscriptions.length > 0) {
        const subscriptionIds = subscriptions.map(s => s.id);
        await supabase
          .from('user_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .not('id', 'in', `(${subscriptionIds.join(',')})`);
      } else {
        await supabase
          .from('user_subscriptions')
          .delete()
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Exception syncing subscription data:', error);
    }
  };

  const setSubscriptions = (newSubscriptions: Subscription[]) => {
    setSubscriptionsState(newSubscriptions);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        setSubscriptions,
        loading,
        syncToSupabase,
        loadFromSupabase,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
