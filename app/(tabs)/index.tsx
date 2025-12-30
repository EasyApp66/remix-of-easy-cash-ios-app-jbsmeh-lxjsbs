
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

export default function TabsIndex() {
  const { user, loading } = useAuth();

  console.log('TabsIndex: Redirecting...', { user: !!user, loading });

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  // If user is logged in, redirect to budget
  if (user) {
    return <Redirect href="/(tabs)/budget" />;
  }

  // If not logged in, redirect to welcome screen
  return <Redirect href="/(tabs)/(home)" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
