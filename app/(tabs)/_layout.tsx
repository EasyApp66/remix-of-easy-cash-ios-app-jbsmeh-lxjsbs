
import React, { useEffect } from 'react';
import { Stack, useRouter, usePathname } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { BackHandler } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function TabLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { loading } = useAuth();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      const rootPaths = ['/(tabs)/budget', '/(tabs)/abo', '/(tabs)/profile', '/(tabs)/(home)'];
      const isRootPath = rootPaths.some(path => pathname === path || pathname.startsWith(path));
      
      if (isRootPath) {
        return true;
      }
      
      return false;
    });

    return () => backHandler.remove();
  }, [pathname]);

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

  const isAuthScreen = 
    pathname === '/(tabs)' || 
    pathname === '/(tabs)/(home)' || 
    pathname === '/(tabs)/(home)/login' ||
    pathname.includes('/(home)/login') ||
    pathname.includes('/login') ||
    pathname === '/';
  
  const shouldShowTabBar = !loading && !isAuthScreen;

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(home)" />
        <Stack.Screen name="budget" />
        <Stack.Screen name="abo" />
        <Stack.Screen name="profile" />
      </Stack>
      {shouldShowTabBar && <FloatingTabBar tabs={tabs} />}
    </>
  );
}
