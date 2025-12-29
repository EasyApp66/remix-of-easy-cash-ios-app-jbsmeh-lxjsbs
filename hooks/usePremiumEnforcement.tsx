
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'expo-router';
import { useLimitTracking } from '@/contexts/LimitTrackingContext';
import { useAuth } from '@/contexts/AuthContext';

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
  const pathname = usePathname();
  const { setPreviousRoute } = useLimitTracking();
  const { isAdmin } = useAuth();

  // Check if user is trying to exceed limits
  const checkAndEnforceLimits = () => {
    // Don't enforce if user is admin or has premium
    if (isAdmin || isPremium) {
      console.log('Premium enforcement: Bypassed (Admin:', isAdmin, 'Premium:', isPremium, ')');
      return false;
    }

    // Check if any limit is exceeded
    // Free limits: 2 months, 6 expenses per month, 6 subscriptions
    const hasExceededMonthsLimit = monthsCount > 2;
    const hasExceededExpensesLimit = maxExpensesPerMonth > 6;
    const hasExceededSubscriptionsLimit = subscriptionsCount > 6;

    const shouldEnforce = 
      hasExceededMonthsLimit || 
      hasExceededExpensesLimit || 
      hasExceededSubscriptionsLimit;

    console.log('Premium enforcement check:', {
      isAdmin,
      isPremium,
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
    // Admins can always perform actions
    if (isAdmin) {
      console.log(`Action ${actionType} allowed - user is admin`);
      return true;
    }

    // Premium users can always perform actions
    if (isPremium) {
      console.log(`Action ${actionType} allowed - user has premium`);
      return true;
    }

    // Check current limits based on action type
    let wouldExceedLimit = false;
    
    switch (actionType) {
      case 'addMonth':
        wouldExceedLimit = monthsCount >= 2;
        break;
      case 'addExpense':
        wouldExceedLimit = maxExpensesPerMonth >= 6;
        break;
      case 'addSubscription':
        wouldExceedLimit = subscriptionsCount >= 6;
        break;
    }

    console.log(`Action ${actionType} check:`, {
      isAdmin,
      isPremium,
      wouldExceedLimit,
      currentCount: actionType === 'addMonth' ? monthsCount : actionType === 'addExpense' ? maxExpensesPerMonth : subscriptionsCount,
    });

    return !wouldExceedLimit;
  };

  // Function to redirect to premium purchase when limit is reached
  const redirectToPremium = () => {
    // Admins should never be redirected
    if (isAdmin) {
      console.log('Redirect to premium blocked - user is admin');
      return;
    }

    console.log('Redirecting to premium purchase page from:', pathname);
    
    // Store the current route so we can navigate back to it
    setPreviousRoute(pathname);
    
    router.push({
      pathname: '/(tabs)/profile',
      params: { showPremium: 'true' },
    });
  };

  return { 
    checkAndEnforceLimits,
    canPerformAction,
    redirectToPremium,
  };
}
