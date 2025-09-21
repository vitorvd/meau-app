import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "../components/Input";
import { auth } from "../config/firebaseConfig";

type FormValues = {
  email: string;
  senha: string;
};

const inputsData = [
  {
    name: "email",
    placeholder: "E-mail",
    rules: {
      required: "E-mail é obrigatório",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Formato de e-mail inválido",
      },
    },
  },
  {
    name: "senha",
    placeholder: "Senha",
    secureTextEntry: true,
    rules: {
      required: "Senha é obrigatória",
    },
  },
] as const

export default function LoginScreen() {
  const navigation = useNavigation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.senha);
      navigation.navigate("Home" as never);
    } catch (error: any) {
      console.error("Falha para autenticar", error.code, error.message);
      alert("Falha para autenticar, verifique suas credenciais de acesso.");
    }
  }

  const sendForm = () => {
    handleSubmit(onSubmit)();
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      {
        inputsData.map((inputData) => (
          <Input
            name={inputData.name}
            key={inputData.name}
            placeholder={inputData.placeholder}
            control={control}
            rules={inputData.rules}
            errors={errors}
          />
        ))
      }

      <Button
        text="Entrar"
        type="oceanBlue"
        onPress={sendForm}
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
