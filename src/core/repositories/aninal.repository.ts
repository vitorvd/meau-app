import { db } from "@/src/config/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import { Animal } from "../listeners/created-animal.listener";

export const ANIMALS_COLLECTION_NAME = "animals";

export class AnimalRepository {
  
  static async findAll() {
    const q = query(collection(db, ANIMALS_COLLECTION_NAME));
    return (await getDocs(q)).docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  static async findByUserId(userId: string) {
    const q = query(collection(db, ANIMALS_COLLECTION_NAME));
    const allAnimals = (await getDocs(q)).docs.map(doc => ({ id: doc.id, ...doc.data() } as Animal));
    return allAnimals.filter(animal => animal.userId === userId);
  }

}