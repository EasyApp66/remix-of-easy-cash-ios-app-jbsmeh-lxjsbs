
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { BudgetProvider } from '@/contexts/BudgetContext';
import { LimitTrackingProvider } from '@/contexts/LimitTrackingContext';
import { useEffect } from 'react';
import { LogBox } from 'react-native';

// Ignore specific warnings that are not critical
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function RootLayout() {
  useEffect(() => {
    console.log('RootLayout: App initialized');
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <LimitTrackingProvider>
          <SubscriptionProvider>
            <BudgetProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen 
                  name="modal" 
                  options={{ 
                    presentation: 'modal',
                    headerShown: false,
                  }} 
                />
                <Stack.Screen 
                  name="formsheet" 
                  options={{ 
                    presentation: 'formSheet',
                    headerShown: false,
                  }} 
                />
                <Stack.Screen 
                  name="transparent-modal" 
                  options={{ 
                    presentation: 'transparentModal',
                    headerShown: false,
                    animation: 'fade',
                  }} 
                />
              </Stack>
            </BudgetProvider>
          </SubscriptionProvider>
        </LimitTrackingProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
