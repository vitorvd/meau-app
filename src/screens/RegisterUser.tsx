import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ScrollView, StatusBar, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "../components/Input";
import Upload from "../components/Upload";

type InputData = {
  name: string;
  placeholder: string;
}

const inputsPersonalData = [
  {name: "nomeCompleto", placeholder: "Nome completo"},
  {name: "idade", placeholder: "Idade"},
  {name: "email", placeholder: "E-mail"},
  {name: "estado", placeholder: "Estado"},
  {name: "cidade", placeholder: "Cidade"},
  {name: "endereco", placeholder: "Endereço"},
  {name: "telefone", placeholder: "Telefone"},
]

const inputsProfileData = [
  {name: "nomeUsuario", placeholder: "Nome de usuário"},
  {name: "senha", placeholder: "Senha"},
  {name: "senhaConfirmada", placeholder: "Confirmação de senha"},
]

export default function RegisterUserScreen() {
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
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.subTitle}>Informações pessoais</Text>
        { 
          inputsPersonalData.map((inputData: InputData) => (
            <Input name={inputData.name} placeholder={inputData.placeholder} control={control}            
            />
          ))
        }

        <Text style={styles.subTitle}>Informações de perfil</Text>
        { 
          inputsProfileData.map((inputData: InputData) => (
            <Input name={inputData.name} placeholder={inputData.placeholder} control={control}            
            />
          ))
        }

        <Upload
          label="Foto de perfil"
          text="adicionar foto"
          styleType="oceanBlue"
        />

        <Button
          text="Fazer Cadastro"
          type="oceanBlue"
          onPress={sendForm}
        />
      </ScrollView>
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
