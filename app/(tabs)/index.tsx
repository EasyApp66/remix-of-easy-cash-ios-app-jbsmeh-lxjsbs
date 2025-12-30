
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';

export default function TabsIndex() {
  const { user, loading } = useAuth();

  console.log('TabsIndex: Checking auth state', { user: !!user, loading });

  // Show loading indicator while checking auth
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  // If user is authenticated, redirect to budget screen
  if (user) {
    console.log('TabsIndex: User authenticated, redirecting to budget');
    return <Redirect href="/(tabs)/budget" />;
  }

  // If not authenticated, redirect to welcome screen
  console.log('TabsIndex: User not authenticated, redirecting to welcome');
  return <Redirect href="/(tabs)/(home)" />;
}
