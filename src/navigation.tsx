import MaterialIcons from '@expo/vector-icons/MaterialIcons';
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
        screenOptions={{ 
          headerStyle: { backgroundColor: '#fff' }
        }}
      >
        <Stack.Screen 
          name="Home"
          component={Home}
          options={() => ({ 
            headerTitle: '',
            headerStyle: { backgroundColor: '#fff' },
            headerLeft: () => (
              <MaterialIcons name="menu" size={28} color="#88c9bf" />
            ),
           })}
        />
        <Stack.Screen
          name="AdoptionList"
          component={AdoptionScreen}
          options={({ navigation }) => ({ 
            headerTitle: 'Adotar',
            headerStyle: {
              backgroundColor: '#ffd358',
            },
            headerLeft: () => (
              <MaterialIcons name="menu" size={28} color="#434343" onPress={() => navigation.navigate("Home" as never)} />
            ),
            headerRight: () => (
              <MaterialIcons name="search" size={28} color="#434343" />
            ),
          })}
        />
        <Stack.Screen 
          name="ConfirmAdoption" 
          component={ConfirmAdoptionScreen} 
          options={({ navigation }) => ({ 
            headerTitle: 'Adoção Confirmada',
            headerStyle: {
              backgroundColor: '#cfe9e5',
            },
            headerLeft: () => (
              <MaterialIcons name="arrow-back" size={24} color="#434343" onPress={() => navigation.goBack()} />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
