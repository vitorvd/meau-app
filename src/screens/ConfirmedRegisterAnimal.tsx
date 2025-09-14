import { useNavigation } from "@react-navigation/native";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Confirmed from "../components/Confirmed";

export default function ConfirmedRegisterAnimalScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <Confirmed
        title="Oba!"
        buttonText="Meus Pets"
        styleType="yellow"
        text={
            `
O cadastro do seu pet foi realizado
com sucesso! 

Certifique-se que permitiu o envio de 
notificações por push no campo
privacidade do menu configurações do
aplicativo. Assim, poderemos te avisar
assim que alguém interessado entrar
em contato!
            `
          }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
    paddingTop: StatusBar.currentHeight,
  },
});
