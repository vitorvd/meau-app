import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
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
import CheckboxGroup from "../components/CheckboxGroup";
import Input from "../components/Input";
import RadioGroup from "../components/RadioGroup";
import Upload from "../components/Upload";
import { useAuth } from "../contexts/AuthContext";
import { EventBus, EventTypes } from "../core/EventBus";

type FormValues = {
  nome: string;
  especie: "cachorro" | "gato";
  sexo: "macho" | "femea";
  porte: "pequeno" | "medio" | "grande";
  faixaEtaria: "filhote" | "adulto" | "idoso";
  temperamento: string[];
  saude: string[];
  doencas?: string;
  sobreAnimal: string;
  exigenciaAdocao?: string[];
  acompanhamentoPosAdocaoCheckBoxChildren?: string[];
  userId: string;
};

export default function RegisterAnimal() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      temperamento: [],
      saude: [],
      exigenciaAdocao: [],
      acompanhamentoPosAdocaoCheckBoxChildren: [],
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    data.userId = user!.uid;

    EventBus.getEventBus().emit(EventTypes.CREATED_ANIMAL, { ...data });
    navigation.navigate("ConfirmedRegisterAnimal" as never);
  }

  const sendForm = () => handleSubmit(onSubmit)();

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
          <View style={formStyles.container}>
            <BaseForm control={control} errors={errors} />
            <AdocaoSection control={control} errors={errors} />

            <Input
              name="sobreAnimal"
              control={control}
              label="Sobre o animal"
              placeholder="Conte uma história sobre o animal"
              errors={errors}
              rules={{
                required: "A descrição sobre o animal é obrigatória",
                minLength: { value: 10, message: "Mínimo 10 caracteres" },
              }}
            />

            <Button
              text="Registrar"
              type="yellow"
              buttonStyle={{ width: 232 }}
              onPress={sendForm}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function BaseForm({ control, errors }: any) {
  return (
    <>
      <Text style={formStyles.title}>Dados do animal</Text>
      
      <Input
        name="nome"
        control={control}
        label="Nome do animal"
        placeholder="Nome do animal"
        errors={errors}
        rules={{
          required: "O nome do animal é obrigatório",
          minLength: { value: 3, message: "O nome deve ter pelo menos 3 caracteres" },
        }}
      />

      <Upload
        label="Fotos do animal"
        text="adicionar foto"
        styleType="yellow"
      />

      <RadioGroup
        name="especie"
        control={control}
        label="Espécie"
        options={[
          { label: "Cachorro", value: "cachorro" },
          { label: "Gato", value: "gato" },
        ]}
        rules={{ required: "Selecione a espécie do animal" }}
        errors={errors}
      />

      <RadioGroup
        name="sexo"
        control={control}
        label="Sexo"
        options={[
          { label: "Macho", value: "macho" },
          { label: "Fêmea", value: "femea" },
        ]}
        rules={{ required: "Selecione o sexo do animal" }}
        errors={errors}
      />

      <RadioGroup
        name="porte"
        control={control}
        label="Porte"
        options={[
          { label: "Pequeno", value: "pequeno" },
          { label: "Médio", value: "medio" },
          { label: "Grande", value: "grande" },
        ]}
        rules={{ required: "Selecione o porte do animal" }}
        errors={errors}
      />

      <RadioGroup
        name="faixaEtaria"
        control={control}
        label="Faixa Etária"
        options={[
          { label: "Filhote", value: "filhote" },
          { label: "Adulto", value: "adulto" },
          { label: "Idoso", value: "idoso" },
        ]}
        rules={{ required: "Selecione a faixa etária do animal" }}
        errors={errors}
      />

      <CheckboxGroup
        name="temperamento"
        control={control}
        label="Temperamentos"
        options={[
          { label: "Brincalhão", value: "brincalhao" },
          { label: "Tímido", value: "timido" },
          { label: "Calmo", value: "calmo" },
          { label: "Guarda", value: "guarda" },
          { label: "Amoroso", value: "amoroso" },
          { label: "Preguiçoso", value: "preguicoso" },
        ]}
      />

      <View>
        <CheckboxGroup
          name="saude"
          control={control}
          label="Saúde"
          options={[
            { label: "Vacinado", value: "vacinado" },
            { label: "Vermifugado", value: "vermifugado" },
            { label: "Castrado", value: "castrado" },
            { label: "Doente", value: "doente" },
          ]}
        />

        <Input
          name="doencas"
          control={control}
          placeholder="Doenças do animal"
        />
      </View>
    </>
  );
}

function AdocaoSection({ control, errors }: any) {
  return (
    <CheckboxGroup
      name="exigenciaAdocao"
      control={control}
      label="Exigências para adoção"
      options={[
        { label: "Termo de adoção", value: "termoAdocao" },
        { label: "Fotos da casa", value: "fotosCasa" },
        { label: "Visita prévia ao animal", value: "visitaPrvia" },
        {
          label: "Acompanhamento pós adoção",
          value: "acompanhamentoPosAdocao",
          extraComponent: (
            <CheckboxGroup
              name="acompanhamentoPosAdocaoCheckBoxChildren"
              control={control}
              options={[
                { label: "1 mês", value: "1mes" },
                { label: "3 meses", value: "3meses" },
                { label: "6 meses", value: "6meses" },
              ]}
              error={errors.acompanhamentoPosAdocaoCheckBoxChildren?.message}
            />
          ),
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: StatusBar.currentHeight },
  scrollView: { flexGrow: 1, backgroundColor: "#fff", alignItems: "center", justifyContent: "flex-start", marginHorizontal: 24 },
});

const formStyles = StyleSheet.create({
  container: { width: "100%", paddingVertical: 24, gap: 15 },
  title: { fontSize: 16, fontFamily: "Roboto-Medium", color: "#434343" },
});
