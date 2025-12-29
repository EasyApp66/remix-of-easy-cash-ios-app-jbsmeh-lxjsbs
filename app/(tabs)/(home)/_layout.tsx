
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function HomeLayout() {
  const router = useRouter();

  useEffect(() => {
    // Prevent back navigation from home screen
    const unsubscribe = router.addListener('beforeRemove', (e) => {
      // Check if we're on the home index screen
      if (e.data.action.type === 'GO_BACK') {
        // Prevent default behavior
        e.preventDefault();
        console.log('Back navigation prevented on home screen');
      }
    });

    return unsubscribe;
  }, [router]);

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
