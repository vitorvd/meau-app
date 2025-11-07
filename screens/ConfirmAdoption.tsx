import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Confirmed from "../components/Confirmed";

export default function ConfirmAdoptionScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <Confirmed
        title="Oba!"
        buttonText="Compartilhar"
        styleType="oceanBlue"
        text={
            `
Ficamos muito felizes com o sucesso 
do seu processo! Esperamos que o  
bichinho esteja curtindo muito essa  
nova experiência! 

Agora que tal compartilhar a história 
da Brisa com todos os outros 
membros do Meau?
            `
          }
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
