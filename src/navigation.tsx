import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdoptionScreen from './screens/Adoption';
import FinishAdoptionScreen from './screens/FinishAdoption';
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
        <Stack.Screen name="Adoption" component={AdoptionScreen} />
        <Stack.Screen name="FinishAdoption" component={FinishAdoptionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
