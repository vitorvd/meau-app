import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdoptionScreen from './screens/AdoptionList';
import ChatListScreen from './screens/ChatList';
import ConfirmAdoptionScreen from './screens/ConfirmAdoption';
import ConfirmedRegisterAnimalScreen from './screens/ConfirmedRegisterAnimal';
import Home from './screens/Home';
import LoginScreen from './screens/Login';
import LoginOrRegisterScreen from './screens/LoginOrRegister';
import RegisterAnimal from './screens/RegisterAnimal';
import RegisterUserScreen from './screens/RegisterUser';

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
              <MaterialIcons name="menu" size={24} color="#88c9bf" />
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
              <MaterialIcons name="menu" size={24} color="#434343" onPress={() => navigation.navigate("Home")} />
            ),
            headerRight: () => (
              <MaterialIcons name="search" size={24} color="#434343" />
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
        <Stack.Screen 
          name="RegisterAnimal" 
          component={RegisterAnimal} 
          options={({ navigation }) => ({ 
            headerTitle: 'Cadastrar Animal',
            headerStyle: {
              backgroundColor: '#ffd358',
            },
            headerLeft: () => (
              <MaterialIcons name="arrow-back" size={24} color="#434343" onPress={() => navigation.goBack()} />
            ),
          })}
        />
        <Stack.Screen 
          name="ConfirmedRegisterAnimal" 
          component={ConfirmedRegisterAnimalScreen} 
          options={({ navigation }) => ({ 
            headerTitle: 'Cadastro do animal',
            headerStyle: {
              backgroundColor: '#ffd358',
            },
            headerLeft: () => (
              <MaterialIcons name="arrow-back" size={24} color="#434343" onPress={() => navigation.goBack()} />
            ),
          })}
        />
        <Stack.Screen 
          name="NotAuthorizared" 
          component={LoginOrRegisterScreen} 
          options={({ navigation }) => ({ 
            headerTitle: 'Acesso negado',
            headerStyle: {
              backgroundColor: '#88c9bf',
            },
            headerLeft: () => (
              <MaterialIcons name="arrow-back" size={24} color="#434343" onPress={() => navigation.goBack()} />
            ),
          })}
        />
        <Stack.Screen 
          name="RegisterUser" 
          component={RegisterUserScreen} 
          options={({ navigation }) => ({ 
            headerTitle: 'Cadastro Pessoal',
            headerStyle: {
              backgroundColor: '#88c9bf',
            },
            headerLeft: () => (
              <MaterialIcons name="menu" size={24} color="#434343"  onPress={() => navigation.goBack()} />
            ),
          })}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={({ navigation }) => ({ 
            headerTitle: 'Login',
            headerStyle: {
              backgroundColor: '#88c9bf',
            },
            headerLeft: () => (
              <MaterialIcons name="menu" size={24} color="#434343"  onPress={() => navigation.goBack()} />
            ),
          })}
        />
        <Stack.Screen 
          name="ChatList" 
          component={ChatListScreen} 
          options={({ navigation }) => ({ 
            headerTitle: 'Chat',
            headerStyle: {
              backgroundColor: '#88c9bf',
            },
            headerLeft: () => (
              <MaterialIcons name="menu" size={24} color="#434343"  onPress={() => navigation.goBack()} />
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
