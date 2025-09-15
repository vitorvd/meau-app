import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "../components/Input";

type InputData = {
  name: string;
  placeholder: string;
}

const inputsData = [
  {name: "nomeUsuario", placeholder: "Nome de usuário "},
  {name: "senha", placeholder: "Senha"},
]

export default function LoginScreen() {
  const navigation = useNavigation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit: SubmitHandler<any> = (data) => console.log(data);

  const sendForm = () => { 
    handleSubmit(onSubmit)();
    navigation.navigate("Home" as never);
  }

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
            onPress={sendForm}
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
  scrollView: {
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
  },
  subTitle: {
    paddingTop: 28,
    color: "#88c9bf",
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    width: "100%",
  },
});
