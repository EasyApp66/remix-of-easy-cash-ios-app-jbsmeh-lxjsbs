
import React, { useEffect } from 'react';
import { Stack, useRouter, usePathname } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { BackHandler } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  // Handle Android back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // If we're on a root tab screen, prevent back navigation
      const rootPaths = ['/(tabs)/budget', '/(tabs)/abo', '/(tabs)/profile', '/(tabs)/(home)'];
      const isRootPath = rootPaths.some(path => pathname === path || pathname.startsWith(path));
      
      if (isRootPath) {
        console.log('Back button pressed on root tab, preventing navigation');
        return true; // Prevent default back behavior
      }
      
      return false; // Allow default back behavior for other screens
    });

    return () => backHandler.remove();
  }, [pathname]);

  // Define the tabs configuration - only 3 tabs now
  const tabs: TabBarItem[] = [
    {
      name: 'budget',
      route: '/(tabs)/budget',
      icon: 'attach-money',
      label: 'Budget',
    },
    {
      name: 'abo',
      route: '/(tabs)/abo',
      icon: 'subscriptions',
      label: 'Abos',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
      label: 'Profil',
    },
  ];

  // Determine if we should show the tab bar
  // Hide on welcome and login pages, show only when user is authenticated
  const shouldShowTabBar = user && !loading && 
    !pathname.includes('/(home)') && 
    !pathname.includes('/login');

  console.log('Tab bar visibility:', { 
    shouldShowTabBar, 
    user: !!user, 
    loading, 
    pathname 
  });

  // For Android and Web, use Stack navigation with conditional floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen 
          key="index" 
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="budget" name="budget" />
        <Stack.Screen key="abo" name="abo" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      {shouldShowTabBar && <FloatingTabBar tabs={tabs} />}
    </>
  );
}
