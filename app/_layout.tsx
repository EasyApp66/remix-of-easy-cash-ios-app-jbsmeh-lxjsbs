
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { BudgetProvider } from '@/contexts/BudgetContext';
import { LimitTrackingProvider } from '@/contexts/LimitTrackingContext';
import { useEffect } from 'react';
import { LogBox } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Splash screen already hidden or error
});

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

export default function RootLayout() {
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Error hiding splash screen:', error);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <LimitTrackingProvider>
          <SubscriptionProvider>
            <BudgetProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen 
                  name="modal" 
                  options={{ 
                    presentation: 'modal',
                  }} 
                />
                <Stack.Screen 
                  name="formsheet" 
                  options={{ 
                    presentation: 'formSheet',
                  }} 
                />
                <Stack.Screen 
                  name="transparent-modal" 
                  options={{ 
                    presentation: 'transparentModal',
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
