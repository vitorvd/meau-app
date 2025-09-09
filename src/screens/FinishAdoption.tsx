import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type RootStackParamList = {
  Home: undefined;
  Adoption: undefined;
  FinishAdoption: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function FinishAdoptionScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={headerStyle.view}>
        <TouchableOpacity onPress={() => navigation.navigate("Adoption")}>
          <MaterialIcons name="arrow-back" size={24} color="#434343" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Oba!</Text>
        <Text style={styles.text}>
            Ficamos muito felizes com o sucesso {"\n"}
            do seu processo! Esperamos que o  {"\n"}    
            bichinho esteja curtindo muito essa  {"\n"}
            nova experiência! {"\n"}
            {"\n"}
            Agora que tal compartilhar a história {"\n"}
            da Brisa com todos os outros {"\n"}
            membros do Meau? {"\n"}
        </Text>
        <TouchableOpacity style={styles.oceanBlueButton}>
            <Text style={styles.buttonText}>Compartilhar</Text>
        </TouchableOpacity>
     </View>
    </SafeAreaView>
  );
}

const headerStyle = StyleSheet.create({
  view: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#cfe9e5",
    padding: 20,
    width: "100%",
    height: 60,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  container: {
    flex: 1,
    alignItems: "center", 
    justifyContent: "space-evenly",
    backgroundColor: "#fafafa",
    width: "100%",
    paddingHorizontal: 25,
    paddingVertical: 30,
    gap: 25,
  },
  title: {
    fontSize: 53,
    fontFamily: "Courgette-Regular",
    color: "#88c9bf",
  },
  text: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: "#757575",
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.5
  },
  oceanBlueButton: {
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
    borderColor: "#88c9bf",
    backgroundColor: "#88c9bf",
  },
  buttonText: {
    fontSize: 12,
    color: "#434343",
    textTransform: "uppercase",
  },
});
