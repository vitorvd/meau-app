import { getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";

export type Chat = {
  id: string;
  animalOwnerId: string; // ID do dono do animal
  animalId: string; // ID do animal
  initiatorId: string; // ID da pessoa que iniciou o chat
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

export class ChatService {
  private static async getUserInfo(userId: string): Promise<{ name: string; photoURL?: string }> {
    try {
      console.log("🔍 Buscando usuário:", userId);
      
      // Primeiro, tentar buscar na collection users
      const userDoc = await getDoc(doc(db, "users", userId));
      console.log("📄 Documento existe:", userDoc.exists());
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("📋 Dados do usuário encontrado:", userData);
        
        const name = userData.nomeCompleto || userData.name || userData.displayName || userData.email?.split('@')[0] || "Usuário";
        console.log("✅ Nome final:", name);
        
        return {
          name,
          photoURL: userData.photoURL
        };
      }
      
      // Se não encontrar na collection users, tentar buscar no Firebase Auth
      console.log("❌ Usuário não encontrado na collection users");
      console.log("🔍 ID procurado:", userId);
      console.log("🔍 IDs disponíveis na collection users:");
      
      // Debug: listar todos os IDs para comparação
      const usersRef = collection(db, "users");
      const allUsersSnapshot = await getDocs(usersRef);
      allUsersSnapshot.docs.forEach((doc, index) => {
        console.log(`  ${index + 1}. ${doc.id}`);
      });
      
      // Tentar sincronizar usuário do Firebase Auth
      return await this.syncUserFromAuth(userId);
    } catch (error) {
      console.error("❌ Erro ao buscar informações do usuário:", error);
      return {
        name: `Usuário ${userId.substring(0, 6)}`,
        photoURL: undefined
      };
    }
  }
  static async getChatsForUser(userId: string): Promise<Chat[]> {
    try {
      // Buscar conversas onde o usuário é dono do animal ou iniciador
      const conversationsRef = collection(db, "conversations");
      const q = query(
        conversationsRef,
        where("animalOwnerId", "==", userId)
      );
      const q2 = query(
        conversationsRef,
        where("initiatorId", "==", userId)
      );
      
      const [querySnapshot1, querySnapshot2] = await Promise.all([
        getDocs(q),
        getDocs(q2)
      ]);
      
      const chats: Chat[] = [];
      const processedIds = new Set<string>();
      
      // Processar conversas onde o usuário é dono do animal
      for (const chatDoc of querySnapshot1.docs) {
        if (processedIds.has(chatDoc.id)) continue;
        processedIds.add(chatDoc.id);
        
        const chatData = chatDoc.data();
        const chat = await this.processChatDocument(chatDoc.id, chatData, userId);
        if (chat) chats.push(chat);
      }
      
      // Processar conversas onde o usuário é iniciador
      for (const chatDoc of querySnapshot2.docs) {
        if (processedIds.has(chatDoc.id)) continue;
        processedIds.add(chatDoc.id);
        
        const chatData = chatDoc.data();
        const chat = await this.processChatDocument(chatDoc.id, chatData, userId);
        if (chat) chats.push(chat);
      }
      
      // Ordenar por última mensagem (mais recente primeiro)
      return chats.sort((a, b) => {
        if (!a.lastMessage && !b.lastMessage) return 0;
        if (!a.lastMessage) return 1;
        if (!b.lastMessage) return -1;
        return b.lastMessage.createdAt?.toMillis() - a.lastMessage.createdAt?.toMillis();
      });
    } catch (error) {
      console.error("Erro ao buscar chats:", error);
      return [];
    }
  }

  private static async processChatDocument(chatId: string, chatData: any, currentUserId: string): Promise<Chat | null> {
    try {
      // Buscar a última mensagem do chat
      const messagesRef = collection(db, "conversations", chatId, "messages");
      const messagesQuery = query(messagesRef, orderBy("createdAt", "desc"));
      const messagesSnapshot = await getDocs(messagesQuery);
      
      let lastMessage = undefined;
      if (!messagesSnapshot.empty) {
        const lastMsgDoc = messagesSnapshot.docs[0];
        lastMessage = {
          text: lastMsgDoc.data().text,
          senderId: lastMsgDoc.data().senderId,
          createdAt: lastMsgDoc.data().createdAt,
        };
      }
      
      // Determinar o outro usuário
      const otherUserId = chatData.animalOwnerId === currentUserId 
        ? chatData.initiatorId 
        : chatData.animalOwnerId;
      
      // Buscar informações do outro usuário
      let otherUserInfo = undefined;
      if (otherUserId) {
        otherUserInfo = await this.getUserInfo(otherUserId);
      }
      
      return {
        id: chatId,
        animalOwnerId: chatData.animalOwnerId,
        animalId: chatData.animalId,
        initiatorId: chatData.initiatorId,
        lastMessage,
        animalName: chatData.animalName,
        otherUserInfo,
        createdAt: chatData.createdAt,
      };
    } catch (error) {
      console.error("Erro ao processar documento do chat:", error);
      return null;
    }
  }

  static async getOrCreateChat(
    animalOwnerId: string, 
    initiatorId: string, 
    animalId: string, 
    animalName?: string
  ): Promise<string> {
    try {
      // Verificar se já existe uma conversa para este animal entre estes usuários
      const conversationsRef = collection(db, "conversations");
      const q = query(
        conversationsRef,
        where("animalId", "==", animalId),
        where("animalOwnerId", "==", animalOwnerId),
        where("initiatorId", "==", initiatorId)
      );
      const querySnapshot = await getDocs(q);
      
      // Se já existe, retornar o ID da conversa existente
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
      }
      
      // Se não existe, criar uma nova conversa
      const newChatRef = doc(collection(db, "conversations"));
      await setDoc(newChatRef, {
        animalOwnerId,
        initiatorId,
        animalId,
        animalName,
        createdAt: new Date(),
      });
      
      return newChatRef.id;
    } catch (error) {
      console.error("Erro ao criar/buscar chat:", error);
      throw error;
    }
  }

  static async getChatMessages(chatId: string): Promise<ChatMessage[]> {
    try {
      const messagesRef = collection(db, "conversations", chatId, "messages");
      const q = query(messagesRef, orderBy("createdAt", "asc"));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        text: doc.data().text,
        senderId: doc.data().senderId,
        createdAt: doc.data().createdAt,
      }));
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      return [];
    }
  }

  // Método de debug para verificar usuários na collection
  static async debugUsers(): Promise<void> {
    try {
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(usersRef);
      
      console.log("=== DEBUG USERS ===");
      console.log("Total de usuários encontrados:", querySnapshot.docs.length);
      
      querySnapshot.docs.forEach((doc, index) => {
        const userData = doc.data();
        console.log(`Usuário ${index + 1}:`, {
          id: doc.id,
          nomeCompleto: userData.nomeCompleto,
          name: userData.name,
          displayName: userData.displayName,
          email: userData.email
        });
      });
      console.log("=== FIM DEBUG ===");
    } catch (error) {
      console.error("Erro ao fazer debug dos usuários:", error);
    }
  }

  // Método para sincronizar usuário do Firebase Auth para a collection users
  private static async syncUserFromAuth(userId: string): Promise<{ name: string; photoURL?: string }> {
    try {
      console.log("🔄 Tentando sincronizar usuário do Firebase Auth:", userId);
      
      // Buscar informações do usuário no Firebase Auth
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (user && user.uid === userId) {
        console.log("🔐 Usuário encontrado no Firebase Auth");
        const displayName = user.displayName || user.email?.split('@')[0] || "Usuário";
        
        // Tentar salvar na collection users para futuras consultas
        try {
          await setDoc(doc(db, "users", userId), {
            nomeCompleto: displayName,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            syncedFromAuth: true,
            syncedAt: new Date()
          });
          console.log("✅ Usuário sincronizado para collection users");
        } catch (syncError) {
          console.log("⚠️ Erro ao sincronizar usuário:", syncError);
        }
        
        return {
          name: displayName,
          photoURL: user.photoURL || undefined
        };
      }
      
      console.log("❌ Usuário não encontrado no Firebase Auth");
      return {
        name: `Usuário ${userId.substring(0, 6)}`,
        photoURL: undefined
      };
    } catch (error) {
      console.error("❌ Erro ao sincronizar usuário:", error);
      return {
        name: `Usuário ${userId.substring(0, 6)}`,
        photoURL: undefined
      };
    }
  }
}
