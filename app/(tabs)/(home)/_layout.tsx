
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
        gestureEnabled: false, // Disable swipe gestures on welcome/login screens
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
          animation: 'fade',
          gestureEnabled: false, // No swipe on welcome screen
        }}
      />
      <Stack.Screen 
        name="login" 
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 250,
          gestureEnabled: true, // Allow back swipe on login screen
        }}
      />
    </Stack>
  );
}
