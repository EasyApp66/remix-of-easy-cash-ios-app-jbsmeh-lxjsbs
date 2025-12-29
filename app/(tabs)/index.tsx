
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

export default function TabsIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('TabsIndex: Auth state:', { user: !!user, loading });
    
    // Wait for auth to finish loading
    if (loading) {
      console.log('TabsIndex: Still loading auth...');
      return;
    }

    // Navigate based on auth state
    const timer = setTimeout(() => {
      if (user) {
        console.log('TabsIndex: User authenticated, navigating to budget');
        router.replace('/(tabs)/budget');
      } else {
        console.log('TabsIndex: No user, navigating to home');
        router.replace('/(tabs)/(home)');
      }
    }, 100);

    return () => clearTimeout(timer);
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
