import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { AuthProvider } from './src/contexts/AuthContext';
import Navigation from './src/navigation/navigation';


import { NavigationContainerRef } from '@react-navigation/native';
import './src/core/listeners';
import { initializeNotificationListeners, setNavigationRef } from './src/core/services/notifications';

enableScreens();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto-Regular': require('./assets/fonts/roboto/Roboto-Regular.ttf'),
    'Roboto-Medium': require('./assets/fonts/roboto/Roboto-Medium.ttf'),
    'Roboto-Bold': require('./assets/fonts/roboto/Roboto-Bold.ttf'),
    'Courgette-Regular': require('./assets/fonts/Courgette-Regular.ttf'),
  });

  const navigationRef = useRef<NavigationContainerRef<any> | null>(null);
  
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      if(navigationRef.current){
        setNavigationRef(navigationRef.current);
        initializeNotificationListeners();
      }
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <Navigation navigationRef={navigationRef}/>
      </SafeAreaProvider>
    </AuthProvider>
  );
}
