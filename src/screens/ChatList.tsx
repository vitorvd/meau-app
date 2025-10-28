import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, db } from "../config/firebaseConfig";

type Message = {
  id: string;
  text: string;
  senderId: string;
  createdAt: any;
};

type ChatScreenProps = {
  route: {
    params: {
      otherUserId: string;
      otherUserName: string;
    };
  };
};

export default function ChatScreen({ route }: ChatScreenProps) {
  const { otherUserId, otherUserName } = route.params;
  const currentUserId = auth.currentUser?.uid!;
  const chatId = [currentUserId, otherUserId].sort().join("_");

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
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
    if (inputText.trim() === "") return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      text: inputText,
      senderId: currentUserId,
      createdAt: serverTimestamp(),
    });

    setInputText("");
  };

  const renderItem = ({ item }: { item: Message }) => {
    const isMe = item.senderId === currentUserId;
    return (
      <View style={[styles.messageContainer, isMe ? styles.myMessage : styles.theirMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
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
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 10 }}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={`Mensagem para ${otherUserName}`}
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Text style={{ color: "#fff" }}>Enviar</Text>
          </TouchableOpacity>
        </View>
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
});
