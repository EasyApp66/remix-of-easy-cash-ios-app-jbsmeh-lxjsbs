
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { BudgetProvider } from '@/contexts/BudgetContext';
import { LimitTrackingProvider } from '@/contexts/LimitTrackingContext';
import { useEffect, useState } from 'react';
import { LogBox, Platform, View, ActivityIndicator } from 'react-native';
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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('RootLayout: App initialized on platform:', Platform.OS);
    
    // Ensure everything is ready before rendering
    const initializeApp = async () => {
      try {
        console.log('RootLayout: Starting app initialization...');
        
        // Wait for polyfills and modules to be fully loaded
        // This ensures that window object and storage adapters are ready
        await new Promise(resolve => setTimeout(resolve, 200));
        
        console.log('RootLayout: App initialization complete');
        setIsReady(true);
        
        // Hide splash screen after a short delay to ensure everything is loaded
        setTimeout(async () => {
          try {
            await SplashScreen.hideAsync();
            console.log('RootLayout: Splash screen hidden');
          } catch (error) {
            console.log('RootLayout: Error hiding splash screen:', error);
          }
        }, 800);
      } catch (error) {
        console.error('RootLayout: Error during initialization:', error);
        setIsReady(true); // Still set ready to avoid infinite loading
      }
    };

    initializeApp();
  }, []);

  // Show loading indicator while initializing
  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

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
