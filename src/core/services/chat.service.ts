import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export type Chat = {
  id: string;
  animalOwnerId: string; 
  animalId: string; 
  initiatorId: string; 
  lastMessage?: {
    text: string;
    senderId: string;
    createdAt: any;
  };
  animalName?: string;
  otherUserInfo?: {
    name: string;
    photoURL?: string;
  };
  createdAt: any;
};

export type ChatMessage = {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
};

const chatsRef = collection(db, "chats");

export class ChatService {

  private static async getUserInfo(userId: string): Promise<{ name: string; photoURL?: string }> {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        const name = userData.nomeCompleto || userData.name || userData.displayName || userData.email?.split('@')[0] || "Usuário";
        
        return {
          name,
          photoURL: userData.photoURL || undefined
        };
      }
      
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user && user.uid === userId) {
        const displayName = user.displayName || user.email?.split('@')[0] || "Usuário";
        
        try {
          await setDoc(doc(db, "users", userId), {
            nomeCompleto: displayName,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            syncedFromAuth: true,
            syncedAt: new Date()
          });
        } catch (syncError) {
          console.warn("⚠️ Erro ao sincronizar usuário:", syncError);
        }
        
        return {
          name: displayName,
          photoURL: user.photoURL || undefined
        };
      }
      
      return {
        name: `Usuário ${userId.substring(0, 6)}`,
        photoURL: undefined
      };
    } catch (error) {
      console.error("❌ Erro ao buscar/sincronizar usuário:", error);
      return {
        name: `Usuário ${userId.substring(0, 6)}`,
        photoURL: undefined
      };
    }
  }

  public static async getOrCreateChat(
    animalOwnerId: string, 
    initiatorId: string, 
    animalId: string,
    animalName: string = "Animal"
  ): Promise<string> {
    
    const participants = [animalOwnerId, initiatorId].sort();

    const q = query(
      chatsRef,
      where("animalId", "==", animalId),
      where("participants", "==", participants) 
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    } else {
      const newChatData = {
        animalOwnerId,
        initiatorId,
        animalId,
        animalName,
        participants, 
        createdAt: new Date(),
      };

      const docRef = await addDoc(chatsRef, newChatData);
      return docRef.id;
    }
  }

  public static async getChatsForUser(userId: string): Promise<Chat[]> {
    const q = query(
      chatsRef,
      where("participants", "array-contains", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    const chats: Chat[] = [];

    for (const docSnap of snapshot.docs) {
      const chatData = docSnap.data() as Chat;
      
      const otherUserId = chatData.animalOwnerId === userId 
        ? chatData.initiatorId 
        : chatData.animalOwnerId;

      const otherUserInfo = await this.getUserInfo(otherUserId);
      
      const { id: _discardedId, ...chatFields } = chatData as any;
      
      chats.push({
        id: docSnap.id,
        ...chatFields,
        otherUserInfo,
      });
    }

    return chats;
  }
}