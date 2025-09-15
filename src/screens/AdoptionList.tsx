import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ListAdoption() {
  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AnimalCard />
        <AnimalCard />
      </ScrollView>
    </SafeAreaView>
  );
}

function AnimalCard() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={animalStyle.card} onPress={() => navigation.navigate("ConfirmAdoption" as never)}>
      <View style={animalStyle.header}>
        <Text style={animalStyle.headerText}>Brisa</Text>
        <MaterialIcons style={animalStyle.headerText} name="favorite-border" size={24} />
      </View>
      <Image source={require('../../assets/images/brisa.jpeg')} style={animalStyle.image} />
      <View style={{ paddingVertical: 20, justifyContent: "center", gap: 3, height: "20%" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-around", paddingBottom: 3 }}>
          <Text style={animalStyle.footerText}>Fêmea</Text>
          <Text style={animalStyle.footerText}>Adulta</Text>
          <Text style={animalStyle.footerText}>Médio</Text>
        </View>
        <Text style={animalStyle.footerText}>Guará II</Text>
      </View>
    </TouchableOpacity>
  );
}

const animalStyle = StyleSheet.create({
  card: {
    width: "100%",
    height: 300,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.50,
    shadowRadius: 3.84, 
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fee29b",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: "15%",
  },
  headerText: {
    fontSize: 16,
    fontFamily: "Roboto-Medium",
    color: " rgba(67, 67, 67, 0.8)",
  },
  image: {
    width: "100%",
    height: "65%",
    resizeMode: "cover",
  },
  footerText: {
    textTransform: "uppercase",
    fontSize: 12,
    color: " rgba(67, 67, 67, 0.8)",
    textAlign: "center",
    fontFamily: "Roboto-Regular",
    letterSpacing: 0.5
  }
});

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
    paddingHorizontal: 25,
    paddingVertical: 30,
    gap: 25,
  },
});
