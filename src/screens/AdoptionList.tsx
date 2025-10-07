import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { collection, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../config/firebaseConfig';
import { Animal } from '../core/listeners/created-animal.listener';

export default function ListAdoption() {
  const [animals, setAnimals] = useState<Animal[]>([]);

  useEffect(() => {
    const q = query(collection(db, "animals"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const animalsList: Animal[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Animal[];

      const visibleAnimals = animalsList.filter(animal => animal.visivel !== false);
      setAnimals(visibleAnimals);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {animals.map((animal, index) => (
          <AnimalCard key={index} animal={animal} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

interface AnimalCardProps {
  animal: Animal;
}

function AnimalCard({ animal }: AnimalCardProps) {
  type RootStackParamList = {
    AnimalDetail: { animal: Animal };
  };

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <TouchableOpacity style={animalStyle.card} onPress={() => navigation.navigate("AnimalDetail", { animal })}>
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
