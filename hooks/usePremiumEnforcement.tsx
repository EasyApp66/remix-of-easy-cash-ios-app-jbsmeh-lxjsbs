
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
  const canPerformAction = (actionType: 'addMonth' | 'addExpense' | 'addSubscription'): boolean => {
    if (isPremium) {
      return true;
    }

    // Check limits based on action type
    switch (actionType) {
      case 'addMonth':
        return monthsCount < 1; // Can only have 1 month in free version
      case 'addExpense':
        return maxExpensesPerMonth < 8; // Can only have 8 expenses per month in free version
      case 'addSubscription':
        return subscriptionsCount < 6; // Can only have 6 subscriptions in free version
      default:
        return true;
    }
  };

  // Function to redirect to premium purchase when limit is reached
  const redirectToPremium = () => {
    console.log('Redirecting to premium purchase due to limit reached');
    router.push({
      pathname: '/(tabs)/profile',
      params: { showPremium: 'true' }
    });
  };

  return { 
    checkAndEnforceLimits,
    canPerformAction,
    redirectToPremium,
  };
}
