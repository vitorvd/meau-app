import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from 'firebase/auth';
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "../components/Input";
import { auth } from '../config/firebaseConfig';

type InputData = {
  name: string;
  placeholder: string;
}

const inputsData = [
  { name: "email", placeholder: "E-mail" },
  { name: "senha", placeholder: "Senha" },
]

export default function LoginScreen() {
  const navigation = useNavigation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit: SubmitHandler<any> = (data) => console.log(data);

  const handleSignIn: SubmitHandler<any> = async (data) => {
    try {
      console.log("Autenticando com o usuário:", data.email);
      await signInWithEmailAndPassword(auth, data.email, data.senha);
      console.log("Usuário %s logado com sucesso!", data.email);
      //handleSubmit(onSubmit)();
      navigation.navigate("Home" as never);
    } catch (error: any) {
      console.error("Login com erro!", error.code, error.message);
      alert("Falha no login: verifique seu e-mail e senha.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      {
        inputsData.map((inputData: InputData) => (
          <Input name={inputData.name} key={inputData.name} placeholder={inputData.placeholder} control={control}
          />
        ))
      }

      <Button
        text="Entrar"
        type="oceanBlue"
        onPress={handleSubmit(handleSignIn)}
        containerStyle={{marginVertical: 30}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight ?? 0 + 15,
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 30,
  },
});
