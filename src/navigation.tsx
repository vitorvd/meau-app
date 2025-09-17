import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { BackButton } from './components/ArrowBack';
import { headerStyles } from './constants/global.styles';
import AdoptionScreen from './screens/AdoptionList';
import ConfirmAdoptionScreen from './screens/ConfirmAdoption';
import ConfirmedRegisterAnimalScreen from './screens/ConfirmedRegisterAnimal';
import Home from './screens/Home';
import LoginScreen from './screens/Login';
import LoginOrRegisterScreen from './screens/LoginOrRegister';
import RegisterAnimal from './screens/RegisterAnimal';
import RegisterUserScreen from './screens/RegisterUser';

type ScreenType = {
  name: string;
  component: React.ComponentType<any>;
  label?: string;
  headerTitle: string;
  style: HeaderStyleKey;  // <-- agora só aceita white | yellow | green | lightGreen
  back?: boolean;
}

type HeaderStyleKey = keyof typeof headerStyles;

const Drawer = createDrawerNavigator();

const visibleScreens: ScreenType[] = [
  { name: "Home", component: Home, label: "Início", headerTitle: "", style: "white" },
  { name: "AdoptionList", component: AdoptionScreen, label: "Lista de adoção", headerTitle: "Adotar", style: "yellow" },
  { name: "RegisterAnimal", component: RegisterAnimal, label: "Cadastrar Animal", headerTitle: "Cadastrar Animal", style: "yellow", back: true },
  { name: "RegisterUser", component: RegisterUserScreen, label: "Registrar-se", headerTitle: "Registrar-se", style: "blueOcean" },
  { name: "Login", component: LoginScreen, label: "Login", headerTitle: "Login", style: "blueOcean" },
];

const hiddenScreens: ScreenType[] = [
  { name: "ConfirmAdoption", component: ConfirmAdoptionScreen, headerTitle: "Adoção Confirmada", style: "lightGreen", back: true },
  { name: "ConfirmedRegisterAnimal", component: ConfirmedRegisterAnimalScreen, headerTitle: "", style: "yellow", back: true },
  { name: "NotAuthorizared", component: LoginOrRegisterScreen, headerTitle: "Acesso negado", style: "blueOcean", back: true },
];

export default function Navigation() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
        {visibleScreens.map(({ name, component, label, headerTitle, style, back }) => (
          <Drawer.Screen
            key={name}
            name={name}
            component={component}
            options={{
              drawerLabel: label,
              headerTitle,
              headerStyle: headerStyles[style],
              ...(back && { headerLeft: () => <BackButton /> }),
            }}
          />
        ))}

        {hiddenScreens.map(({ name, component, headerTitle, style, back }) => (
          <Drawer.Screen
            key={name}
            name={name}
            component={component}
            options={{
              drawerItemStyle: { display: "none" },
              headerTitle,
              headerStyle: headerStyles[style],
              ...(back && { headerLeft: () => <BackButton /> }),
            }}
          />
        ))}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
