import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { Animal } from '../core/listeners/created-animal.listener';
import { AnimalRepository } from '../core/repositories/aninal.repository';

type RootStackParamList = {
  AnimalDetail: { animal: Animal; fromMyPets?: boolean };
};

export default function MyPetsList() {
  const { user } = useAuth();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchAnimals = async () => {
      const animalsResponse = await AnimalRepository.findByUserId(user!.uid);
      setAnimals(animalsResponse as Animal[]);
    };

    fetchAnimals();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {animals.map((animal) => (
          <AnimalCard key={animal.id} animal={animal} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

interface AnimalCardProps {
  animal: Animal;
  navigation: StackNavigationProp<RootStackParamList>;
}

function AnimalCard({ animal, navigation }: AnimalCardProps){
  return (
    <TouchableOpacity style={animalStyle.card} activeOpacity={1} onPress={() => navigation.navigate("AnimalDetail", { animal, fromMyPets: true })}>
      <View style={animalStyle.header}>
        <Text style={animalStyle.headerText}>{animal.nome}</Text>
        <MaterialIcons style={animalStyle.headerText} name="favorite-border" size={24} />
      </View>
      <Image source={{ uri: animal.photoURL }} style={animalStyle.image} />
      <View style={{ paddingVertical: 20, justifyContent: "center", gap: 3, height: "20%" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-around", paddingBottom: 3 }}>
          <Text style={animalStyle.footerText}>{animal.sexo}</Text>
          <Text style={animalStyle.footerText}>{animal.faixaEtaria}</Text>
          <Text style={animalStyle.footerText}>{animal.porte}</Text>
        </View>
        <Text style={animalStyle.footerText}>Itália</Text>
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
