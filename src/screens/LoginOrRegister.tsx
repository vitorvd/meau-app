import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StatusBar, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";

export default function LoginOrRegisterScreen() {
  const navigation = useNavigation();

  const handleRegister = () => {
    navigation.navigate("RegisterUser" as never)
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <Text style={styles.title}>Ops!</Text>
      <Text style={styles.comumText}>Você não pode realizar esta ação sem possuir um cadastro</Text>
      <Button
        text="Fazer Cadastro"
        type="oceanBlue"
        onPress={handleRegister}
      />
      <Text style={styles.comumText}>Já possui cadastro?</Text>
      <Button
        text="Fazer Login"
        type="oceanBlue"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 35,
    paddingHorizontal: 60,
  },
  title: {
    fontSize: 53,
    paddingVertical: 52,
    color: "#88c9bf",
    fontFamily: "Courgette-Regular",
  },
  comumText: {
    fontSize: 14    ,
    color: "#757575",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
  }
});
