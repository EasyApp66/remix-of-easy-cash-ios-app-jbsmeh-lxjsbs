
import { Redirect } from 'expo-router';

export default function TabsIndex() {
  // Redirect to the home screen by default
  return <Redirect href="/(tabs)/(home)" />;
}
