import { addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { AnimalRepository } from "../repositories/aninal.repository";
import { NotificationService } from "./notification.service";

export type AdoptionRequest = {
  id?: string;
  animalId: string;
  animalOwnerId: string;
  requesterId: string;
  chatId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: any;
};

export class AdoptionService {
  private static readonly ADOPTION_REQUESTS_COLLECTION = "adoptionRequests";

  static async createAdoptionRequest(
    animalId: string,
    animalOwnerId: string,
    requesterId: string,
    chatId: string
  ): Promise<void> {
    try {
      const existingRequest = await this.getPendingRequest(animalId, requesterId);
      if (existingRequest) {
        throw new Error("Já existe uma solicitação de adoção pendente para este animal");
      }

      const adoptionRequestRef = collection(db, this.ADOPTION_REQUESTS_COLLECTION);
      await addDoc(adoptionRequestRef, {
        animalId,
        animalOwnerId,
        requesterId,
        chatId,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      const messagesRef = collection(db, "conversations", chatId, "messages");
      await addDoc(messagesRef, {
        text: "Estou interessado em adotar este animal!",
        senderId: requesterId,
        createdAt: serverTimestamp(),
        type: "adoption_request",
      });

      const animalDoc = await getDoc(doc(db, "animals", animalId));
      const animalName = animalDoc.exists() ? animalDoc.data().nome : "um animal";

      await NotificationService.sendPushNotification(
        animalOwnerId,
        "Nova solicitação de adoção!",
        `Você recebeu uma solicitação de adoção para ${animalName}`,
        {
          type: "adoption_request",
          animalId,
          chatId,
          requesterId,
        }
      );
    } catch (error) {
      console.error("Erro ao criar solicitação de adoção:", error);
      throw error;
    }
  }

  static async getPendingRequest(animalId: string, requesterId: string): Promise<AdoptionRequest | null> {
    try {
      const requestsRef = collection(db, this.ADOPTION_REQUESTS_COLLECTION);
      const q = query(
        requestsRef,
        where("animalId", "==", animalId),
        where("requesterId", "==", requesterId),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as AdoptionRequest;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar solicitação de adoção:", error);
      return null;
    }
  }

  static async getPendingRequestByChatId(chatId: string): Promise<AdoptionRequest | null> {
    try {
      const requestsRef = collection(db, this.ADOPTION_REQUESTS_COLLECTION);
      const q = query(
        requestsRef,
        where("chatId", "==", chatId),
        where("status", "==", "pending")
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as AdoptionRequest;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar solicitação de adoção por chatId:", error);
      return null;
    }
  }

  static async acceptAdoptionRequest(requestId: string, animalId: string, chatId: string): Promise<void> {
    try {
      const requestRef = doc(db, this.ADOPTION_REQUESTS_COLLECTION, requestId);
      await updateDoc(requestRef, {
        status: "accepted",
      });

      const requestDoc = await getDoc(requestRef);
      if (!requestDoc.exists()) {
        throw new Error("Solicitação não encontrada");
      }
      const requestData = requestDoc.data() as AdoptionRequest;
      const requesterId = requestData.requesterId;

      const animalDoc = await getDoc(doc(db, "animals", animalId));
      if (!animalDoc.exists()) {
        throw new Error("Animal não encontrado");
      }
      const animalData = animalDoc.data();
      const originalOwnerId = animalData.userId;

      const animalRef = doc(db, "animals", animalId);
      await updateDoc(animalRef, {
        userId: requesterId,
        visivel: false,
        originalOwnerId: originalOwnerId,
        adopted: true,
      });

      const animalDoc2 = await getDoc(doc(db, "animals", animalId));
      const animalName = animalDoc2.exists() ? animalDoc2.data().nome : "o animal";

      const messagesRef = collection(db, "conversations", chatId, "messages");
      await addDoc(messagesRef, {
        text: "Adoção aceita! O animal foi transferido para você.",
        senderId: requestData.animalOwnerId,
        createdAt: serverTimestamp(),
        type: "adoption_accepted",
      });

      await NotificationService.sendPushNotification(
        requesterId,
        "Adoção aceita! 🎉",
        `Sua solicitação de adoção para ${animalName} foi aceita!`,
        {
          type: "adoption_accepted",
          animalId,
          chatId,
        }
      );
    } catch (error) {
      console.error("Erro ao aceitar solicitação de adoção:", error);
      throw error;
    }
  }

  static async rejectAdoptionRequest(requestId: string, chatId: string, animalOwnerId: string): Promise<void> {
    try {
      const requestRef = doc(db, this.ADOPTION_REQUESTS_COLLECTION, requestId);
      await updateDoc(requestRef, {
        status: "rejected",
      });

      const requestDoc = await getDoc(doc(db, this.ADOPTION_REQUESTS_COLLECTION, requestId));
      const requestData = requestDoc.exists() ? requestDoc.data() as AdoptionRequest : null;
      const requesterId = requestData?.requesterId;
      const animalId = requestData?.animalId;

      let animalName = "o animal";
      if (animalId) {
        const animalDoc = await getDoc(doc(db, "animals", animalId));
        if (animalDoc.exists()) {
          animalName = animalDoc.data().nome;
        }
      }

      const messagesRef = collection(db, "conversations", chatId, "messages");
      await addDoc(messagesRef, {
        text: "A solicitação de adoção foi recusada.",
        senderId: animalOwnerId,
        createdAt: serverTimestamp(),
        type: "adoption_rejected",
      });

      if (requesterId) {
        await NotificationService.sendPushNotification(
          requesterId,
          "Solicitação de adoção recusada",
          `Sua solicitação de adoção para ${animalName} foi recusada.`,
          {
            type: "adoption_rejected",
            animalId,
            chatId,
          }
        );
      }
    } catch (error) {
      console.error("Erro ao recusar solicitação de adoção:", error);
      throw error;
    }
  }
}

