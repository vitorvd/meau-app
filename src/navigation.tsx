import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdoptionScreen from './screens/AdoptionList';
import ConfirmAdoptionScreen from './screens/ConfirmAdoption';
import Home from './screens/Home';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AdoptionList" component={AdoptionScreen} />
        <Stack.Screen name="ConfirmAdoption" component={ConfirmAdoptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
