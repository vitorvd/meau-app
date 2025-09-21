import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "../components/Input";
import Upload from "../components/Upload";
import { EventBus, EventTypes } from "../core/EventBus";

type FormValues = {
  nomeCompleto: string;
  idade: string;
  email: string;
  estado: string;
  cidade: string;
  endereco: string;
  telefone: string;
  nomeUsuario: string;
  senha: string;
  senhaConfirmada: string;
};

const estadosBrasil = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function RegisterUserScreen() {
  const navigation = useNavigation();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    handleSubmit(onSubmit)();
    EventBus.getEventBus().emit(EventTypes.CREATED_USER, { ...data });
    navigation.navigate("Home" as never);
  };

  const sendForm = () => {
    onSubmit()
  };

  const senha = watch("senha");

  // Campos de dados pessoais
  const inputsPersonalData = [
    {
      name: "nomeCompleto",
      placeholder: "Nome completo",
      rules: {
        required: "Nome é obrigatório",
        minLength: { value: 1, message: "Digite ao menos 1 caractere" },
        pattern: {
          value: /^[A-Za-zÀ-ú\s]+$/,
          message: "Apenas letras são permitidas",
        },
      },
    },
    {
      name: "idade",
      placeholder: "Idade",
      rules: {
        required: "Idade é obrigatória",
        min: { value: 18, message: "Idade mínima é 18" },
        max: { value: 120, message: "Idade máxima é 120" },
        pattern: { value: /^[0-9]+$/, message: "Digite apenas números" },
      },
    },
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
      name: "estado",
      placeholder: "Estado",
      rules: {
        required: "Estado é obrigatório",
        validate: (value: string) =>
          estadosBrasil.includes(value.toUpperCase()) ||
          "Digite a sigla de um estado válido",
      },
    },
    {
      name: "cidade",
      placeholder: "Cidade",
      rules: {
        required: "Cidade é obrigatória",
        minLength: { value: 1, message: "Digite ao menos 1 caractere" },
      },
    },
    {
      name: "endereco",
      placeholder: "Endereço",
      rules: {
        required: "Endereço é obrigatório",
        minLength: { value: 1, message: "Digite ao menos 1 caractere" },
      },
    },
    {
      name: "telefone",
      placeholder: "Telefone",
      rules: {
        required: "Telefone é obrigatório",
        pattern: {
          value: /^[1-9]{2}[0-9]{8,9}$/,
          message: "Digite um telefone válido (ex: 11987654321)",
        },
      },
    },
  ] as const;

  // Campos de perfil
  const inputsProfileData = [
    {
      name: "nomeUsuario",
      placeholder: "Nome de usuário",
      rules: {
        required: "Nome de usuário é obrigatório",
        minLength: { value: 3, message: "Mínimo de 3 caracteres" },
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
    {
      name: "senhaConfirmada",
      placeholder: "Confirmação de senha",
      secureTextEntry: true,
      rules: {
        required: "Confirmação é obrigatória",
        validate: (value: string) =>
          value === senha || "As senhas não coincidem",
      },
    },
  ] as const;

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            As informações preenchidas serão divulgadas 
            apenas para a pessoa com a qual você realizar
            o processo de adoção e/ou apadrinhamento,
            após a formalização do processo.
          </Text>
        </View>

        <Text style={styles.subTitle}>Informações pessoais</Text>
        {inputsPersonalData.map((inputData) => (
          <Input
            key={inputData.name}
            name={inputData.name}
            placeholder={inputData.placeholder}
            control={control}
            rules={inputData.rules}
            errors={errors}
          />
        ))}

        <Text style={styles.subTitle}>Informações de perfil</Text>
        {inputsProfileData.map((inputData) => (
          <Input
            key={inputData.name}
            name={inputData.name}
            placeholder={inputData.placeholder}
            control={control}
            rules={inputData.rules}
            errors={errors}
          />
        ))}

        <Upload
          label="Foto de perfil"
          text="adicionar foto"
          styleType="oceanBlue"
        />

        <Button text="Fazer Cadastro" type="oceanBlue" onPress={sendForm} />
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
    paddingVertical: 16,
  },
  subTitle: {
    paddingTop: 28,
    color: "#88c9bf",
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    width: "100%",
  },
  warningContainer: {
    backgroundColor: "#cfe9e5",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  warningText: {
    fontFamily: "Roboto-Regular",
    fontSize: 14,
    color: "#434343",
    textAlign: "center",
  },
});
