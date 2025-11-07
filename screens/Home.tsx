import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const navigation = useNavigation();
  const { user, loading, logout } = useAuth();

  const handleAdoptionList = () => {
    navigation.navigate('AdoptionList' as never)
  }

  const handleRegisterAnimal = () => {
    navigation.navigate('RegisterAnimal' as never)
  }

  const handleLogout = async () => {
    await logout()
    navigation.navigate('NotAuthorizared' as never)
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
          text="Cadastrar Animal"
          type="yellow"
          onPress={handleRegisterAnimal}
        />

        <Button
          text={'Sair'}
          type="oceanBlue"
          onPress={handleLogout}
        />
      </View>
      <Image
        source={require('../../assets/images/meau-letter-logo.png')}
      />  
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  viewGroupButton: {
    gap: 15
  }
});
