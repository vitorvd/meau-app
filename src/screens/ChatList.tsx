import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";
import { auth, db } from "../config/firebaseConfig";
import { AdoptionRequest, AdoptionService } from "../core/services/adoption.service";
import { ChatService } from "../core/services/chat.service";
import { NotificationService } from "../core/services/notification.service";

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
  const [adoptionRequest, setAdoptionRequest] = useState<AdoptionRequest | null>(null);
  const isAnimalOwner = currentUserId === animalOwnerId;

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const id = await ChatService.getOrCreateChat(animalOwnerId, initiatorId, animalId, animalName);
        setChatId(id);
        
        if (isAnimalOwner) {
          const request = await AdoptionService.getPendingRequestByChatId(id);
          setAdoptionRequest(request);
        }
      } catch (error) {
        console.error("Erro ao inicializar chat:", error);
      }
    };

    initializeChat();
  }, [animalOwnerId, initiatorId, animalId, animalName, isAnimalOwner]);

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

  useEffect(() => {
    if (!chatId || !isAnimalOwner) return;

    const checkAdoptionRequest = async () => {
      const request = await AdoptionService.getPendingRequestByChatId(chatId);
      setAdoptionRequest(request);
    };

    checkAdoptionRequest();
  }, [chatId, isAnimalOwner, messages]);

  const sendMessage = async () => {
    if (inputText.trim() === "" || !chatId) return;

    try {
      const messagesRef = collection(db, "conversations", chatId, "messages");
      await addDoc(messagesRef, {
        text: inputText,
        senderId: currentUserId,
        createdAt: serverTimestamp(),
      });

      const recipientId = currentUserId === animalOwnerId ? initiatorId : animalOwnerId;

      await NotificationService.sendPushNotification(
        recipientId,
        otherUserName || "Nova mensagem",
        inputText.length > 50 ? `${inputText.substring(0, 50)}...` : inputText,
        {
          type: "new_message",
          chatId,
          animalId,
          senderId: currentUserId,
        }
      );

      setInputText("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const handleAcceptAdoption = async () => {
    if (!adoptionRequest?.id || !animalId || !chatId) return;

    Alert.alert(
      "Confirmar adoção",
      "Tem certeza que deseja aceitar esta solicitação de adoção? O animal será transferido para o adotante e removido do catálogo.",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Aceitar",
          onPress: async () => {
            try {
              await AdoptionService.acceptAdoptionRequest(adoptionRequest.id!, animalId, chatId);
              setAdoptionRequest(null);
              Alert.alert("Sucesso", "Adoção aceita! O animal foi transferido.");
            } catch (error: any) {
              console.error("Erro ao aceitar adoção:", error);
              Alert.alert("Erro", error.message || "Erro ao aceitar solicitação de adoção");
            }
          }
        }
      ]
    );
  };

  const handleRejectAdoption = async () => {
    if (!adoptionRequest?.id || !chatId) return;

    Alert.alert(
      "Recusar adoção",
      "Tem certeza que deseja recusar esta solicitação de adoção?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Recusar",
          style: "destructive",
          onPress: async () => {
            try {
              await AdoptionService.rejectAdoptionRequest(adoptionRequest.id!, chatId, animalOwnerId);
              setAdoptionRequest(null);
            } catch (error: any) {
              console.error("Erro ao recusar adoção:", error);
              Alert.alert("Erro", error.message || "Erro ao recusar solicitação de adoção");
            }
          }
        }
      ]
    );
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
            {/* Botões de aceitar/recusar adoção (apenas para o dono do animal) */}
            {isAnimalOwner && adoptionRequest && (
              <View style={styles.adoptionButtonsContainer}>
                <Text style={styles.adoptionRequestText}>
                  Solicitação de adoção pendente
                </Text>
                <View style={styles.adoptionButtonsRow}>
                  <View style={styles.adoptionButtonWrapper}>
                    <Button
                      text="Aceitar"
                      type="oceanBlue"
                      onPress={handleAcceptAdoption}
                      buttonStyle={styles.adoptionButton}
                      containerStyle={styles.adoptionButtonContainer}
                    />
                  </View>
                  <View style={styles.adoptionButtonWrapper}>
                    <Button
                      text="Recusar"
                      type="gray"
                      onPress={handleRejectAdoption}
                      buttonStyle={styles.adoptionButton}
                      containerStyle={styles.adoptionButtonContainer}
                    />
                  </View>
                </View>
              </View>
            )}

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
  adoptionButtonsContainer: {
    padding: 15,
    backgroundColor: "#fff3cd",
    borderBottomWidth: 1,
    borderBottomColor: "#ffc107",
  },
  adoptionRequestText: {
    fontSize: 14,
    color: "#856404",
    fontFamily: "Roboto-Medium",
    marginBottom: 10,
    textAlign: "center",
  },
  adoptionButtonsRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  adoptionButtonWrapper: {
    flex: 1,
    maxWidth: "45%",
  },
  adoptionButtonContainer: {
    width: "100%",
  },
  adoptionButton: {
    width: "100%",
  },
});
