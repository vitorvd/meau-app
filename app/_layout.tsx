import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from 'react';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('../assets/fonts/roboto/Roboto-Regular.ttf'),
    'Roboto-Medium': require('../assets/fonts/roboto/Roboto-Medium.ttf'),
    'Roboto-Bold': require('../assets/fonts/roboto/Roboto-Bold.ttf'),
    'Courgette-Regular': require('../assets/fonts/Courgette-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />
}
