import { Ionicons } from "@expo/vector-icons"; // Ícones (voltar)
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../config/firebaseConfig";
import { ChatService } from "../core/services/chat.service";

type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
};

type ChatScreenProps = {
  route: {
    params: {
      animalOwnerId: string;
      initiatorId: string;
      animalId: string;
      otherUserName: string;
      animalName?: string;
    };
  };
};

export default function ChatScreen({ route }: ChatScreenProps) {
  const { animalOwnerId, initiatorId, animalId, otherUserName, animalName } = route.params;
  const currentUserId = auth.currentUser?.uid!;
  const navigation = useNavigation();
  const [chatId, setChatId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [animalPhoto, setAnimalPhoto] = useState<string | null>(null);

  // 🔹 Buscar a foto do animal no Firestore (coleção global "animals")
  useEffect(() => {
    const fetchAnimalPhoto = async () => {
      try {
        const docRef = doc(db, "animals", animalId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAnimalPhoto(data.photoURL || null);
        }
      } catch (err) {
        console.error("Erro ao buscar foto do animal:", err);
      }
    };

    fetchAnimalPhoto();
  }, [animalId]);

useLayoutEffect(() => {
  navigation.setOptions({
    headerTitleAlign: "left",
    headerTitle: "",
    headerLeft: () => (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ paddingRight: 10, marginLeft: 5 }}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>

        <Image
          source={{
            uri:
              animalPhoto ||
              "https://cdn-icons-png.flaticon.com/512/616/616408.png",
          }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 10,
          }}
        />
        <View>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            {animalName || "Animal"}
          </Text>
          <Text style={{ fontSize: 13, color: "#555" }}>
            Dono: {otherUserName}
          </Text>
        </View>
      </View>
    ),
  });
}, [navigation, animalPhoto, animalName, otherUserName]);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const id = await ChatService.getOrCreateChat(
          animalOwnerId,
          initiatorId,
          animalId,
          animalName
        );
        setChatId(id);
      } catch (error) {
        console.error("Erro ao inicializar chat:", error);
      }
    };

    initializeChat();
  }, [animalOwnerId, initiatorId, animalId, animalName]);


  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, "conversations", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        senderId: doc.data().senderId,
        createdAt: doc.data().createdAt,
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  // 🔹 Enviar mensagem
  const sendMessage = async () => {
    if (inputText.trim() === "" || !chatId) return;

    try {
      const messagesRef = collection(db, "conversations", chatId, "messages");
      await addDoc(messagesRef, {
        text: inputText,
        senderId: currentUserId,
        createdAt: serverTimestamp(),
      });

      setInputText("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const formatMessageTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.senderId === currentUserId;
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.theirMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        <Text
          style={[
            styles.messageTime,
            isMe ? styles.myMessageTime : styles.theirMessageTime,
          ]}
        >
          {formatMessageTime(item.createdAt)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >
        {!chatId ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Inicializando chat...</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ padding: 10 }}
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder={`Mensagem para ${otherUserName}${
                  animalName ? ` sobre ${animalName}` : ""
                }`}
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <Text style={{ color: "#fff" }}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
  },
  myMessage: {
    backgroundColor: "#4f93e6",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#e5e5e5",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#000",
    marginBottom: 2,
  },
  messageTime: {
    fontSize: 10,
    fontStyle: "italic",
  },
  myMessageTime: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  theirMessageTime: {
    color: "rgba(0, 0, 0, 0.5)",
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#4f93e6",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#757575",
    fontFamily: "Roboto-Regular",
  },
});
