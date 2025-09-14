import { useNavigation } from "@react-navigation/native";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
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

export default function RegisterAnimal() {
  const navigation = useNavigation();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const onSubmit: SubmitHandler<any> = (data) => console.log(data);

  const sendForm = () => { 
    handleSubmit(onSubmit)();
    navigation.navigate("ConfirmedRegisterAnimal" as never);
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.comumText}>
          Tenho interesse em cadastrar o animal para:
        </Text>

        <View style={styles.viewGroupButton}>
          <Button
            text="Adoção"
            type="gray"
            buttonStyle={{width: 96}}
          />
          <Button
            text="Apadrinhar"
            type="yellow"
            buttonStyle={{width: 96}}
          />
          <Button
            text="Ajuda"
            type="gray"
            buttonStyle={{width: 96}}
          />
        </View>

        <View style={formStyles.container}>
          <BaseForm control={control}/>

          <ApadrinhamentoSection control={control}/>

          <AdocaoSection control={control}/>

          <AjudaSection control={control}/>

          <Input
            name="sobreAnimal"
            control={control}
            label="Sobre o animal"
            placeholder="Conte uma história sobre o animal"
          />

          <Button
            text="Registrar"
            type="yellow"
            buttonStyle={{ width: 232 }}
            onPress={sendForm}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function BaseForm({control}: any) {
  return <>
    <Text style={formStyles.title}>Dados do animal</Text>
    
    <Input
      name="nome"
      control={control}
      label="Nome do animal"
      placeholder="Nome do animal" />

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
    />
        
    <RadioGroup
      name="sexo"
      control={control}
      label="Sexo"
      options={[
        { label: "Macho", value: "macho" },
        { label: "Fêmea", value: "femea" },
      ]}
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
}

function ApadrinhamentoSection({control}: any) {
  return <>
    <CheckboxGroup
      name="exigenciaApadrinhamento"
      control={control}
      label="Exigências para apadrinhamento"
      options={[
        {
          label: "Termo de apadrinhamento",
          value: "termoApadrinhamento",
        },
        {
          label: "Auxílio financeiro",
          value: "auxiliofinanceiro",
          extraComponent: 
            <CheckboxGroup
              name="tipoAuxilio"
              control={control}
              options={[
                { label: "Alimentação", value: "alimentacao" },
                { label: "Saúde", value: "saude" },
                { label: "Objetos", value: "objetos" },
              ]}
            />,
        },
        { label: "Visitas ao animal", value: "visitasAnimal" },
      ]}
    />
  </>
}

function AdocaoSection({control}: any) {
  return <>
    <CheckboxGroup
      name="exigenciaAdocao"
      control={control}
      label="Exigências para adoção"
      options={[
        {
          label: "Termo de adoção",
          value: "termoAdocao",
        },
        {
          label: "Fotos da casa",
          value: "fotosCasa",
        },
        {
          label: "Visita prévia ao animal",
          value: "visitaPrvia",
        },
        {
          label: "Acompanhamento pós adoção",
          value: "acompanhamentoPosAdocao",
          extraComponent: 
            <CheckboxGroup
              name="acompanhamentoPosAdocaoCheckBoxChildren"
              control={control}
              options={[
                { label: "1 mês", value: "1mes" },
                { label: "3 meses", value: "3meses" },
                { label: "6 meses", value: "6meses" },
              ]}
            />,
        },
      ]}
    />
  </>
}

function AjudaSection({control}: any) {
  return <>
    <CheckboxGroup
      name="necessidadesAjudaAnimal"
      control={control}
      label="Necessidades do animal"
      options={[
        {
          label: "Alimento",
          value: "alimento",
        },
        {
          label: "Auxílio financeiro",
          value: "auxilioFinanceiro",
        },
        { 
          label: "Medicamento",
          value: "medicamento",
          extraComponent: <Input name="Nome do medicamento" control={control} placeholder="Nome do medicamento" />
        },
      ]}
    />
  </>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    marginHorizontal: 24,
  },
  comumText: {
    fontSize: 14,
    color: "#757575",
    marginVertical: 16,
    fontFamily: "Roboto-Regular",
    width: "100%",
  },
  viewGroupButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});

const formStyles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 24,
    gap: 15,
  },
  title: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: "#434343",
  }
});
