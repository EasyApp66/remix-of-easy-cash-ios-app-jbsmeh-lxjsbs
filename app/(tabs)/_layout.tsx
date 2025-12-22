
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration - only 3 tabs now
  const tabs: TabBarItem[] = [
    {
      name: 'budget',
      route: '/(tabs)/budget',
      icon: 'account-balance-wallet',
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

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="budget" name="budget" />
        <Stack.Screen key="abo" name="abo" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
