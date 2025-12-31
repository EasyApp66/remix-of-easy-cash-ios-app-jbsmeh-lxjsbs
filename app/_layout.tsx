
import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme, View, ActivityIndicator, Platform, LogBox } from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { BudgetProvider } from "@/contexts/BudgetContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch((error) => {
  console.log('SplashScreen preventAutoHideAsync error:', error);
});

// Ignore specific warnings that are not critical
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
]);

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, fontError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    console.log('RootLayout: Initializing on platform:', Platform.OS);
    
    async function prepare() {
      try {
        // Log font loading status
        if (fontError) {
          console.error('RootLayout: Font loading error:', fontError);
        }
        
        if (loaded) {
          console.log('RootLayout: Fonts loaded successfully');
          
          // Small delay to ensure everything is ready
          await new Promise(resolve => setTimeout(resolve, 100));
          
          setAppReady(true);
          
          // Hide splash screen
          await SplashScreen.hideAsync();
          console.log('RootLayout: Splash screen hidden');
        }
      } catch (e) {
        console.error('RootLayout: Error during preparation:', e);
        // Still set app as ready to avoid infinite loading
        setAppReady(true);
      }
    }

    prepare();
  }, [loaded, fontError]);

  // Show loading screen while fonts are loading
  if (!loaded || !appReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "rgb(0, 122, 255)",
      background: "rgb(242, 242, 247)",
      card: "rgb(255, 255, 255)",
      text: "rgb(0, 0, 0)",
      border: "rgb(216, 216, 220)",
      notification: "rgb(255, 59, 48)",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(10, 132, 255)",
      background: "rgb(1, 1, 1)",
      card: "rgb(28, 28, 30)",
      text: "rgb(255, 255, 255)",
      border: "rgb(44, 44, 46)",
      notification: "rgb(255, 69, 58)",
    },
  };

  return (
    <>
      <StatusBar style="auto" animated />
      <ThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
      >
        <AuthProvider>
          <LanguageProvider>
            <SubscriptionProvider>
              <BudgetProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: 'fade',
                    animationDuration: 200,
                  }}
                >
                  <Stack.Screen
                    name="(tabs)"
                    options={{
                      headerShown: false,
                      animation: 'fade',
                    }}
                  />
                </Stack>
              </BudgetProvider>
            </SubscriptionProvider>
          </LanguageProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}
