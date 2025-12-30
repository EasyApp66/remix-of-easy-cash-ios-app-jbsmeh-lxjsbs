
import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

export default function TabsIndex() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const timer = setTimeout(() => {
      if (user) {
        router.replace('/(tabs)/budget');
      } else {
        router.replace('/(tabs)/(home)');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [user, loading, router]);

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
