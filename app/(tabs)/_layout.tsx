
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
      const rootPaths = ['/(tabs)/budget', '/(tabs)/abo', '/(tabs)/profile'];
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
  const isWelcomeOrLogin = pathname === '/(tabs)' || 
                           pathname === '/(tabs)/(home)' || 
                           pathname === '/(tabs)/(home)/' ||
                           pathname === '/(tabs)/(home)/index' ||
                           pathname === '/(tabs)/(home)/login' ||
                           pathname.includes('/login');
  
  const shouldShowTabBar = user && !loading && !isWelcomeOrLogin;

  console.log('Tab bar visibility:', { 
    shouldShowTabBar, 
    user: !!user, 
    loading, 
    pathname,
    isWelcomeOrLogin
  });

  // For Android and Web, use Stack navigation with conditional floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          animationDuration: 200,
          gestureEnabled: false, // Disable swipe gestures
        }}
      >
        <Stack.Screen 
          key="index" 
          name="index"
          options={{
            headerShown: false,
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          key="home" 
          name="(home)"
          options={{
            animation: 'slide_from_right',
            animationDuration: 250,
            gestureEnabled: false, // Disable swipe on welcome/login screens
          }}
        />
        <Stack.Screen 
          key="budget" 
          name="budget"
          options={{
            animation: 'fade',
            animationDuration: 200,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          key="abo" 
          name="abo"
          options={{
            animation: 'fade',
            animationDuration: 200,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          key="profile" 
          name="profile"
          options={{
            animation: 'fade',
            animationDuration: 200,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen 
          key="legal" 
          name="legal"
          options={{
            animation: 'slide_from_right',
            animationDuration: 250,
            gestureEnabled: true,
          }}
        />
      </Stack>
      {shouldShowTabBar && <FloatingTabBar tabs={tabs} />}
    </>
  );
}
