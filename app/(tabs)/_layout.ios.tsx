
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { useAuth } from '@/contexts/AuthContext';
import { usePathname } from 'expo-router';

export default function TabLayout() {
  const { loading } = useAuth();
  const pathname = usePathname();

  const isAuthScreen = 
    pathname === '/(tabs)' || 
    pathname === '/(tabs)/(home)' || 
    pathname === '/(tabs)/(home)/login' ||
    pathname.includes('/(home)/login') ||
    pathname.includes('/login') ||
    pathname === '/';
  
  const shouldShowTabBar = !loading && !isAuthScreen;

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index" hidden={true}>
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(home)" hidden={true}>
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="budget" hidden={!shouldShowTabBar}>
        <Icon sf="dollarsign.circle.fill" />
        <Label>Budget</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="abo" hidden={!shouldShowTabBar}>
        <Icon sf="repeat.circle.fill" />
        <Label>Abos</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile" hidden={!shouldShowTabBar}>
        <Icon sf="person.fill" />
        <Label>Profil</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="legal" hidden={true}>
        <Icon sf="doc.text.fill" />
        <Label>Legal</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
