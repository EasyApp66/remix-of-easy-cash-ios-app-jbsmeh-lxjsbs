
import React, { createContext, useContext, useState, ReactNode } from 'react';

type ActionType = 'addMonth' | 'addExpense' | 'addSubscription' | null;

interface LastAction {
  type: ActionType;
  data: any;
  timestamp: number;
  previousRoute?: string; // Store the route where the action was triggered
}

interface LimitTrackingContextType {
  lastAction: LastAction | null;
  setLastAction: (action: LastAction | null) => void;
  clearLastAction: () => void;
  shouldRollback: boolean;
  setShouldRollback: (value: boolean) => void;
  previousRoute: string | null;
  setPreviousRoute: (route: string | null) => void;
}

const LimitTrackingContext = createContext<LimitTrackingContextType | undefined>(undefined);

export function LimitTrackingProvider({ children }: { children: ReactNode }) {
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [shouldRollback, setShouldRollback] = useState(false);
  const [previousRoute, setPreviousRoute] = useState<string | null>(null);

  const clearLastAction = () => {
    console.log('Clearing last action');
    setLastAction(null);
    setShouldRollback(false);
  };

  return (
    <LimitTrackingContext.Provider
      value={{
        lastAction,
        setLastAction,
        clearLastAction,
        shouldRollback,
        setShouldRollback,
        previousRoute,
        setPreviousRoute,
      }}
    >
      {children}
    </LimitTrackingContext.Provider>
  );
}

export function useLimitTracking() {
  const context = useContext(LimitTrackingContext);
  if (context === undefined) {
    throw new Error('useLimitTracking must be used within a LimitTrackingProvider');
  }
  return context;
}
