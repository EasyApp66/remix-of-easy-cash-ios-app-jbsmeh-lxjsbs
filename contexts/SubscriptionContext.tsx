
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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

  const loadFromSupabase = useCallback(async () => {
    if (!user) {
      console.log('SubscriptionContext: No user, skipping Supabase load');
      return;
    }

    try {
      setLoading(true);
      console.log('SubscriptionContext: Loading subscription data from Supabase for user:', user.id);

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('SubscriptionContext: Error loading subscriptions:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log('SubscriptionContext: No subscription data found in Supabase');
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

      console.log('SubscriptionContext: Successfully loaded', loadedSubscriptions.length, 'subscriptions from Supabase');
      setSubscriptionsState(loadedSubscriptions);
    } catch (error) {
      console.error('SubscriptionContext: Exception loading subscription data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const syncToSupabase = useCallback(async () => {
    if (!user) {
      console.log('SubscriptionContext: No user, skipping Supabase sync');
      return;
    }

    try {
      console.log('SubscriptionContext: Syncing', subscriptions.length, 'subscriptions to Supabase for user:', user.id);

      // Sync subscriptions
      for (const subscription of subscriptions) {
        const { error } = await supabase
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

        if (error) {
          console.error('SubscriptionContext: Error syncing subscription:', subscription.id, error);
        }
      }

      // Delete subscriptions that are no longer in the list
      if (subscriptions.length > 0) {
        const subscriptionIds = subscriptions.map(s => s.id);
        const { error: deleteError } = await supabase
          .from('user_subscriptions')
          .delete()
          .eq('user_id', user.id)
          .not('id', 'in', `(${subscriptionIds.join(',')})`);

        if (deleteError) {
          console.error('SubscriptionContext: Error deleting old subscriptions:', deleteError);
        }
      } else {
        // If no subscriptions, delete all for this user
        const { error: deleteAllError } = await supabase
          .from('user_subscriptions')
          .delete()
          .eq('user_id', user.id);

        if (deleteAllError) {
          console.error('SubscriptionContext: Error deleting all subscriptions:', deleteAllError);
        }
      }

      console.log('SubscriptionContext: Successfully synced all subscription data to Supabase');
    } catch (error) {
      console.error('SubscriptionContext: Exception syncing subscription data:', error);
    }
  }, [user, subscriptions]);

  // Load data from Supabase when user logs in
  useEffect(() => {
    if (user) {
      console.log('SubscriptionContext: User logged in, loading subscription data from Supabase');
      loadFromSupabase().catch(error => {
        console.error('SubscriptionContext: Error loading data:', error);
      });
    }
  }, [user, loadFromSupabase]);

  // Auto-sync to Supabase whenever subscriptions change (debounced)
  useEffect(() => {
    if (user && subscriptions.length >= 0) {
      const timeoutId = setTimeout(() => {
        console.log('SubscriptionContext: Auto-syncing subscription data to Supabase');
        syncToSupabase().catch(error => {
          console.error('SubscriptionContext: Error syncing data:', error);
        });
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [subscriptions, user, syncToSupabase]);

  const setSubscriptions = (newSubscriptions: Subscription[]) => {
    console.log('SubscriptionContext: Setting subscriptions:', newSubscriptions.length);
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
