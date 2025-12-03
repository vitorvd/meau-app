import { db } from "@/src/config/firebaseConfig";
import {
  addDoc,
  collection, doc,
  documentId,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch
} from "firebase/firestore";
import { Animal } from "../listeners/created-animal.listener";

export const ANIMALS_COLLECTION_NAME = "animals";
const INTERESTS_COLLECTION_NAME = "interest"; 
const USERS_COLLECTION_NAME = "users"; 

export type InterestItem = {
  userId: string;
  userName: string;
  status: 'pending' | 'accepted' | 'rejected';
  id?: string;
};

export class AnimalRepository {
  
  static async addInterest(animalId: string, userId: string) {
    const interestsRef = collection(db, INTERESTS_COLLECTION_NAME);
    const q = query(
      interestsRef, 
      where("animalId", "==", animalId), 
      where("userId", "==", userId)
    );
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, { status: "pending" });
    } else {
      await addDoc(interestsRef, {
        animalId,
        userId,
        status: 'pending',
        createdAt: new Date(),
      });
    }
  }

  static async getPendingInterests(animalId: string): Promise<InterestItem[]> {
    const interestsRef = collection(db, INTERESTS_COLLECTION_NAME);
    const usersRef = collection(db, USERS_COLLECTION_NAME);

    const q = query(interestsRef, where("animalId", "==", animalId), where("status", "==", "pending"));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return [];

    const interests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const userIds = interests.map((i: any) => i.userId);

    const usersQuery = query(usersRef, where(documentId(), "in", userIds));
    const usersSnapshot = await getDocs(usersQuery);
    const usersMap = new Map();
    usersSnapshot.forEach(doc => {
      usersMap.set(doc.id, doc.data());
    });

    const interestsWithUserDetails: InterestItem[] = interests.map((interest: any) => {
      const userData = usersMap.get(interest.userId);
      return {
        userId: interest.userId,
        userName: userData?.nomeCompleto || userData?.name || interest.userId, 
        status: interest.status,
        id: interest.id,
      };
    });

    return interestsWithUserDetails;
  }

  static async acceptInterest(animalId: string, acceptedUserId: string): Promise<void> {
    const batch = writeBatch(db);
    const interestsRef = collection(db, INTERESTS_COLLECTION_NAME);
    const animalsRef = collection(db, ANIMALS_COLLECTION_NAME);

    const animalDocRef = doc(animalsRef, animalId);
    batch.update(animalDocRef, { 
      status: 'adopted', 
      visivel: false 
    });

    const acceptedInterestQuery = query(
      interestsRef, 
      where("animalId", "==", animalId), 
      where("userId", "==", acceptedUserId)
    );
    const acceptedInterestSnap = await getDocs(acceptedInterestQuery);

    if (!acceptedInterestSnap.empty) {
      const acceptedInterestDocRef = acceptedInterestSnap.docs[0].ref;
      batch.update(acceptedInterestDocRef, { status: "accepted" });
    } else {
      throw new Error("Interesse a ser aceito não encontrado.");
    }

    const rejectedInterestsQuery = query(
      interestsRef, 
      where("animalId", "==", animalId), 
      where("userId", "!=", acceptedUserId), 
      where("status", "==", "pending") 
    );
    const rejectedInterestsSnap = await getDocs(rejectedInterestsQuery);

    rejectedInterestsSnap.docs.forEach(doc => {
      batch.update(doc.ref, { status: "rejected" });
    });

    await batch.commit();
  }

  static async rejectInterest(animalId: string, rejectedUserId: string): Promise<void> {
    const interestsRef = collection(db, INTERESTS_COLLECTION_NAME);
    const rejectedInterestQuery = query(
      interestsRef, 
      where("animalId", "==", animalId), 
      where("userId", "==", rejectedUserId),
      where("status", "==", "pending")
    );
    const snapshot = await getDocs(rejectedInterestQuery);

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;
      await updateDoc(docRef, { status: "rejected" });
    }
  }

  
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