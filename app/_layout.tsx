
import { Stack } from 'expo-router';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';
import { BudgetProvider } from '@/contexts/BudgetContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <LanguageProvider>
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
      </LanguageProvider>
    </AuthProvider>
  );
}
