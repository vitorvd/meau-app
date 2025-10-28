import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import Input from "../components/Input";
import Upload from "../components/Upload";
import { storage } from "../config/firebaseConfig";
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
  photoURL?: string;
};

const estadosBrasil = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA",
  "PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
];

export default function RegisterUserScreen() {
  const navigation = useNavigation();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm<FormValues>();

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("É necessária a permissão para acessar a câmera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const selectFromGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("É necessária a permissão para acessar suas fotos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleChoosePhoto = () => {
    Alert.alert(
      "Selecionar Foto de Perfil",
      "Escolha uma opção",
      [
        {
          text: "Tirar Foto...",
          onPress: takePhoto,
        },
        {
          text: "Escolher da Galeria...",
          onPress: selectFromGallery,
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ],
      { cancelable: true } // Permite fechar o alerta tocando fora
    );
  };

  const uploadImageAsync = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const fileName = `users/${Date.now()}/profile.jpg`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, blob);
    return await getDownloadURL(storageRef);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    if (!imageUri) {
      alert("Por favor, selecione uma foto de perfil.");
      return;
    }

    setIsSubmitting(true);
    try {
      const downloadURL = await uploadImageAsync(imageUri);
      
      data.photoURL = downloadURL;

      EventBus.getEventBus().emit(EventTypes.CREATED_USER, { ...data });
      navigation.navigate("Home" as never);

    } catch (error) {
      console.error("Erro no cadastro de usuário:", error);
      alert("Ocorreu um erro ao criar seu cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendForm = () => {
    handleSubmit(onSubmit)();
  };

  const senha = watch("senha");

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
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
            text={imageUri ? "Trocar foto" : "Adicionar foto"}
            styleType="oceanBlue"
            onPress={handleChoosePhoto}
            imageUri={imageUri}
          />

          <Button text="Fazer Cadastro" type="oceanBlue" onPress={sendForm} />
        </ScrollView>
      </KeyboardAvoidingView>
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
    flexGrow: 1,
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