
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe back gesture
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="login"
        options={{
          gestureEnabled: true, // Allow swipe back from login
        }}
      />
    </Stack>
  );
}
