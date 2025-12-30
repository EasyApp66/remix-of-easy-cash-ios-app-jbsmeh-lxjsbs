
import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 250,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false,
          animation: 'fade',
        }}
      />
      <Stack.Screen 
        name="login" 
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          animationDuration: 250,
        }}
      />
    </Stack>
  );
}
