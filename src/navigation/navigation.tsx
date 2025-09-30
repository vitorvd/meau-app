import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { BackButton } from '.././components/ArrowBack';
import { headerStyles } from '.././constants/global.styles';
import AdoptionScreen from '.././screens/AdoptionList';
import ConfirmAdoptionScreen from '.././screens/ConfirmAdoption';
import ConfirmedRegisterAnimalScreen from '.././screens/ConfirmedRegisterAnimal';
import Home from '.././screens/Home';
import LoginScreen from '.././screens/Login';
import LoginOrRegisterScreen from '.././screens/LoginOrRegister';
import RegisterAnimal from '.././screens/RegisterAnimal';
import RegisterUserScreen from '.././screens/RegisterUser';
import { useAuth } from '../contexts/AuthContext';
import AnimalDetail from '../screens/AnimalDetail';

type ScreenType = {
  name: string;
  component: React.ComponentType<any>;
  label?: string;
  headerTitle: string;
  style: HeaderStyleKey;  // <-- agora só aceita white | yellow | green | lightGreen
  back?: boolean;
  visible?: boolean;
}

type HeaderStyleKey = keyof typeof headerStyles;

const Drawer = createDrawerNavigator();

const visibleScreens: ScreenType[] = [
  { name: "Home", component: Home, label: "Início", headerTitle: "", style: "white" },
  { name: "AdoptionList", component: AdoptionScreen, label: "Lista de adoção", headerTitle: "Adotar", style: "yellow" },
  { name: "RegisterAnimal", component: RegisterAnimal, label: "Cadastrar Animal", headerTitle: "Cadastrar Animal", style: "yellow", back: true },
];

const hiddenScreens: ScreenType[] = [
  { name: "ConfirmAdoption", component: ConfirmAdoptionScreen, headerTitle: "Adoção Confirmada", style: "lightGreen", back: true, visible: false },
  { name: "ConfirmedRegisterAnimal", component: ConfirmedRegisterAnimalScreen, headerTitle: "", style: "yellow", back: true, visible: false },
  { name: "NotAuthorizared", component: LoginOrRegisterScreen, headerTitle: "Acesso negado", style: "blueOcean", back: true, visible: false },
  { name: "AnimalDetail", component: AnimalDetail, headerTitle: "Detalhes do Animal", style: "yellow", back: true, visible: false },
];

const authorizatedScreens = visibleScreens.concat(hiddenScreens);

const unauthorizatedScreens: ScreenType[] = [
  { name: "RegisterUser", component: RegisterUserScreen, label: "Registrar-se", headerTitle: "Registrar-se", style: "blueOcean" },
  { name: "Login", component: LoginScreen, label: "Login", headerTitle: "Login", style: "blueOcean" },
  { name: "NotAuthorizared", component: LoginOrRegisterScreen, headerTitle: "Acesso negado", style: "blueOcean", back: true, visible: false },
  { name: "Home", component: Home, label: "Início", headerTitle: "", style: "white", visible: false },
]

export default function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    // ou mostrar Splash/Loading
    console.log('Autenticando...')
    return null; 
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName={user ? "Home" : "NotAuthorizared"} screenOptions={{ headerShown: true }}>
        {(user ? authorizatedScreens : unauthorizatedScreens).map(
          ({ name, component, label, headerTitle, style, back, visible }) => (
            <Drawer.Screen
              key={name}
              name={name}
              component={component}
              options={{
                drawerLabel: label,
                drawerItemStyle: {
                  display: visible === false ? "none" : "flex", // ⚠️ aqui "flex" é mais seguro que "contents"
                },
                headerTitle,
                headerStyle: headerStyles[style],
                ...(back && { headerLeft: () => <BackButton /> }),
              }}
            />
          )
        )}
      </Drawer.Navigator>

    </NavigationContainer>
  );
}
