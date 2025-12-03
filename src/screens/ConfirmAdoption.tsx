import { useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Confirmed from "../components/Confirmed";

type ConfirmAdoptionRouteParams = {
  title: string;
  buttonText: string;
  text: string;
  navigateTo: string; 
  styleType?: 'yellow' | 'oceanBlue'; 
};

export default function ConfirmAdoptionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const { 
      title = "Oba!", 
      buttonText = "Compartilhar", 
      text = 'Adoção concluída com sucesso!', 
      navigateTo = 'Home', 
      styleType = 'oceanBlue'
  } = route.params as ConfirmAdoptionRouteParams;

  const handleButtonPress = () => {
    (navigation as any).navigate(navigateTo);
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <Confirmed
        title={title}
        buttonText={buttonText}
        styleType={styleType}
        text={text}
        onPress={handleButtonPress} 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight,
  },
});