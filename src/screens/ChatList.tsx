import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
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
  const [chatId, setChatId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const id = await ChatService.getOrCreateChat(animalOwnerId, initiatorId, animalId, animalName);
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
      minute: "2-digit" 
    });
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.senderId === currentUserId;
    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={[styles.messageTime, isMe ? styles.myMessageTime : styles.theirMessageTime]}>
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
                placeholder={`Mensagem para ${otherUserName}${animalName ? ` sobre ${animalName}` : ""}`}
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
