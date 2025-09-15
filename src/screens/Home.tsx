import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";

export default function Home() {
  const navigation = useNavigation();

  const handleAdoptionList = () => {
    navigation.navigate('AdoptionList' as never)
  }

  const handleAjudar = () => {
    navigation.navigate('NotAuthorizared' as never)
  }

  const handleRegisterAnimal = () => {
    navigation.navigate('RegisterAnimal' as never)
  }

  const handleLogin = () => {
    navigation.navigate('Login' as never)
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <Text style={styles.hello}>Olá!</Text>

      <Text style={styles.welcome}>
        Bem vindo ao Meau! {"\n"}
        Aqui você pode adotar, doar e ajudar {"\n"}
        cães e gatos com facilidade. {"\n"}
        Qual o seu interesse?
      </Text>

      <View style={styles.viewGroupButton}>
        <Button
          text="Adotar"
          type="yellow"
          onPress={handleAdoptionList}
        />

        <Button
          text="Ajudar"
          type="yellow"
          onPress={handleAjudar}
        />

        <Button
          text="Cadastrar Animal"
          type="yellow"
          onPress={handleRegisterAnimal}
        />

        <Button
          text="Login"
          type="oceanBlue"
          onPress={handleLogin}
        />
      </View>
      <Image
        source={require('../../assets/images/meau-letter-logo.png')}
      />  
    </SafeAreaView>
  );
}

const baseButtonStyle: ViewStyle = {
  width: 232,
  height: 40,
  borderWidth: 2,
  borderRadius: 5,
  justifyContent: "center",
  alignItems: "center",
  marginVertical: 12,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  hello: {
    fontSize: 72,
    color: "#ffd358",
    fontFamily: "Courgette-Regular",
    marginBottom: 52,
  },
  welcome: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    marginBottom: 48,
  },
  question: {
    fontSize: 18,
    color: "#88c9bf",
    marginBottom: 32,
  },
  yellowButton: {
    ...baseButtonStyle,
    borderColor: "#ffd358",
    backgroundColor: "#ffd358",
    fontFamily: "Roboto-Regular",
  },
  oceanBlueButton: {
    ...baseButtonStyle,
    borderColor: "#88c9bf",
    backgroundColor: "#88c9bf",
    fontFamily: "Roboto-Regular",
  },
  buttonText: {
    fontSize: 12,
    color: " rgba(67, 67, 67, 0.8)",
    textTransform: "uppercase",
  },
  viewGroupButton: {
    gap: 15
  }
});
