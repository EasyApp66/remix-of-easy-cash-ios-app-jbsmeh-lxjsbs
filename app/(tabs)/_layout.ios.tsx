
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'expo-router';

export default function TabLayout() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  // Determine if we should show the tab bar
  // Hide on welcome and login pages, show only when user is authenticated
  const isWelcomeOrLogin = pathname === '/(tabs)' || 
                           pathname === '/(tabs)/(home)' || 
                           pathname === '/(tabs)/(home)/' ||
                           pathname === '/(tabs)/(home)/index' ||
                           pathname === '/(tabs)/(home)/login' ||
                           pathname.includes('/login');
  
  const shouldShowTabBar = user && !loading && !isWelcomeOrLogin;

  console.log('iOS Tab bar visibility:', { 
    shouldShowTabBar, 
    user: !!user, 
    loading, 
    pathname,
    isWelcomeOrLogin
  });

  return (
    <NativeTabs>
      <NativeTabs.Trigger 
        key="index" 
        name="index"
        hidden={true}
      >
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger 
        key="home" 
        name="(home)"
        hidden={true}
      >
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger 
        key="budget" 
        name="budget"
        hidden={!shouldShowTabBar}
      >
        <Icon sf="dollarsign.circle.fill" />
        <Label>Budget</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger 
        key="abo" 
        name="abo"
        hidden={!shouldShowTabBar}
      >
        <Icon sf="repeat.circle.fill" />
        <Label>Abos</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger 
        key="profile" 
        name="profile"
        hidden={!shouldShowTabBar}
      >
        <Icon sf="person.fill" />
        <Label>Profil</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger 
        key="legal" 
        name="legal"
        hidden={true}
      >
        <Icon sf="doc.text.fill" />
        <Label>Legal</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
