
import React, { useEffect } from 'react';
import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

export default function TabsIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Use router.replace instead of Redirect to avoid navigation stack issues
    if (!loading) {
      if (user) {
        router.replace('/(tabs)/budget');
      } else {
        router.replace('/(tabs)/(home)');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.green} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
