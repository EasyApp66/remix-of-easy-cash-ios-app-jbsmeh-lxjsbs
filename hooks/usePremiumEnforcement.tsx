
import { useEffect, useState } from 'react';

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
  const [shouldShowPremiumModal, setShouldShowPremiumModal] = useState(false);

  useEffect(() => {
    // Don't enforce if user already has premium
    if (isPremium) {
      setShouldShowPremiumModal(false);
      return;
    }

    // Check if any limit is exceeded
    const hasExceededMonthsLimit = monthsCount > 2;
    const hasExceededExpensesLimit = maxExpensesPerMonth > 6;
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

    setShouldShowPremiumModal(shouldEnforce);
  }, [monthsCount, maxExpensesPerMonth, subscriptionsCount, isPremium]);

  return { shouldShowPremiumModal };
}
