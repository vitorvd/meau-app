import { db } from "@/src/config/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";

export const ANIMALS_COLLECTION_NAME = "animals";

export class AnimalRepository {
  
  static async findAll() {
    const q = query(collection(db, ANIMALS_COLLECTION_NAME));
    return (await getDocs(q)).docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

}