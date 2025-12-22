
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="budget" name="budget">
        <Icon sf="dollarsign.circle.fill" />
        <Label>Budget</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="abo" name="abo">
        <Icon sf="repeat.circle.fill" />
        <Label>Abos</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="profile" name="profile">
        <Icon sf="person.fill" />
        <Label>Profil</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
