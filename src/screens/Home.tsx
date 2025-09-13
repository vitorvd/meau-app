import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

export default function Home() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.hello}>Olá!</Text>

        <Text style={styles.welcome}>
          Bem vindo ao Meau! {"\n"}
          Aqui você pode adotar, doar e ajudar {"\n"}
          cães e gatos com facilidade. {"\n"}
          Qual o seu interesse?
        </Text>

        <TouchableOpacity
          style={styles.yellowButton}
          onPress={() => navigation.navigate('AdoptionList' as never)}
        >
          <Text style={styles.buttonText}>Adotar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.yellowButton}>
          <Text style={styles.buttonText}>Ajudar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.yellowButton}>
          <Text style={styles.buttonText}>Cadastrar Animal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.oceanBlueButton}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <Image
          source={require('../../assets/images/meau-letter-logo.png')}
        />  
      </View>
    </SafeAreaView>
  );
}

const headerStyle = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    padding: 20,
    width: "100%",
    height: 60,
    position: 'relative',
  },
  text: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    color: "#434343",
    fontFamily: "Roboto-Medium",
  },
});

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
});
