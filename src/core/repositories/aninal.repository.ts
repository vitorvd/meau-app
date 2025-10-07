import { db } from "@/src/config/firebaseConfig";
import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import { Animal } from "../listeners/created-animal.listener";

export const ANIMALS_COLLECTION_NAME = "animals";

export class AnimalRepository {
  
  static async findAll() {
    const q = query(collection(db, ANIMALS_COLLECTION_NAME));
    return (await getDocs(q)).docs.map(doc => {
      const data = doc.data() as Animal;
      return { ...data, id: doc.id, visivel: data.visivel ?? true };
    });
  }

  static async findByUserId(userId: string) {
    const q = query(collection(db, ANIMALS_COLLECTION_NAME));
    const allAnimals = (await getDocs(q)).docs.map(doc => ({ id: doc.id, ...doc.data() } as Animal));
    return allAnimals.filter(animal => animal.userId === userId);
  }

  static async toggleVisibility(animalId: string, visible: boolean) {
    try {
      const animalRef = doc(db, ANIMALS_COLLECTION_NAME, animalId);
      await updateDoc(animalRef, { visivel: visible });
      console.log(`Animal ${animalId} agora está ${visible ? "visível" : "oculto"}.`);
    } catch (error) {
      console.error("Erro ao atualizar visibilidade do animal:", error);
      throw error;
    }
  }  
}