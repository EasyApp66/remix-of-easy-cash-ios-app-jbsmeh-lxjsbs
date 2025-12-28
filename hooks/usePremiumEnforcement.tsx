
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

interface UsePremiumEnforcementProps {
  monthsCount: number;
  maxExpensesPerMonth: number;
  subscriptionsCount: number;
  isPremium: boolean;
}

export function usePremiumEnforcement({
  monthsCount,
  maxExpensesPerMonth,
  subscriptionsCount,
  isPremium,
}: UsePremiumEnforcementProps) {
  const router = useRouter();

  // Check if user is trying to exceed limits
  const checkAndEnforceLimits = () => {
    // Don't enforce if user already has premium
    if (isPremium) {
      return false;
    }

    // Check if any limit is exceeded
    // Free limits: 1 month, 8 expenses per month, 6 subscriptions
    const hasExceededMonthsLimit = monthsCount > 1;
    const hasExceededExpensesLimit = maxExpensesPerMonth > 8;
    const hasExceededSubscriptionsLimit = subscriptionsCount > 6;

    const shouldEnforce = 
      hasExceededMonthsLimit || 
      hasExceededExpensesLimit || 
      hasExceededSubscriptionsLimit;

    console.log('Premium enforcement check:', {
      monthsCount,
      maxExpensesPerMonth,
      subscriptionsCount,
      hasExceededMonthsLimit,
      hasExceededExpensesLimit,
      hasExceededSubscriptionsLimit,
      shouldEnforce,
    });

    return shouldEnforce;
  };

  // Function to check if action should be allowed
  // NOTE: This now always returns true - no limits enforced
  const canPerformAction = (actionType: 'addMonth' | 'addExpense' | 'addSubscription'): boolean => {
    // Always allow actions - no premium enforcement
    console.log(`Action ${actionType} allowed - no limits enforced`);
    return true;
  };

  // Function to redirect to premium purchase when limit is reached
  // NOTE: This is now a no-op since we don't enforce limits
  const redirectToPremium = () => {
    console.log('redirectToPremium called but no action taken - limits removed');
    // Do nothing - limits are removed
  };

  return { 
    checkAndEnforceLimits,
    canPerformAction,
    redirectToPremium,
  };
}
