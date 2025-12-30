
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { BudgetProvider } from '@/contexts/BudgetContext';
import { LimitTrackingProvider } from '@/contexts/LimitTrackingContext';
import { useEffect, useCallback } from 'react';
import { LogBox, Platform } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
  console.log('SplashScreen: Already hidden or error preventing auto hide');
});

// Ignore specific warnings that are not critical
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
]);

export default function RootLayout() {
  useEffect(() => {
    console.log('RootLayout: App initialized on platform:', Platform.OS);
    
    // Hide splash screen after a short delay to ensure everything is loaded
    const timer = setTimeout(async () => {
      try {
        await SplashScreen.hideAsync();
        console.log('RootLayout: Splash screen hidden');
      } catch (error) {
        console.log('RootLayout: Error hiding splash screen:', error);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AuthProvider>
      <LanguageProvider>
        <LimitTrackingProvider>
          <SubscriptionProvider>
            <BudgetProvider>
              <Stack 
                screenOptions={{ 
                  headerShown: false,
                  animation: 'fade',
                  animationDuration: 200,
                }}
              >
                <Stack.Screen 
                  name="(tabs)" 
                  options={{ 
                    headerShown: false,
                    animation: 'fade',
                  }} 
                />
                <Stack.Screen 
                  name="modal" 
                  options={{ 
                    presentation: 'modal',
                    headerShown: false,
                    animation: 'slide_from_bottom',
                    animationDuration: 250,
                  }} 
                />
                <Stack.Screen 
                  name="formsheet" 
                  options={{ 
                    presentation: 'formSheet',
                    headerShown: false,
                    animation: 'slide_from_bottom',
                    animationDuration: 250,
                  }} 
                />
                <Stack.Screen 
                  name="transparent-modal" 
                  options={{ 
                    presentation: 'transparentModal',
                    headerShown: false,
                    animation: 'fade',
                    animationDuration: 150,
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
