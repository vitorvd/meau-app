import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../contexts/AuthContext";
import { Chat, ChatService } from "../core/services/chat.service";

export default function ChatListScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Debug: verificar usuários na collection
      await ChatService.debugUsers();
      
      const userChats = await ChatService.getChatsForUser(user.uid);
      console.log("Chats carregados:", userChats);
      setChats(userChats);
    } catch (error) {
      console.error("Erro ao carregar chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChatPress = (chat: Chat) => {
    (navigation as any).navigate("ChatScreen", {
      animalOwnerId: chat.animalOwnerId,
      initiatorId: chat.initiatorId,
      animalId: chat.animalId,
      otherUserName: chat.otherUserInfo?.name || "Usuário",
      animalName: chat.animalName
    });
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString("pt-BR", { 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando conversas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.chatsContainer}>
          {chats.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma conversa encontrada</Text>
              <Text style={styles.emptySubtext}>Inicie uma conversa sobre um pet!</Text>
            </View>
          ) : (
            chats.map((chat) => (
              <TouchableOpacity 
                key={chat.id} 
                style={chatStyle.rowContainer}
                onPress={() => handleChatPress(chat)}
              >
                <View style={chatStyle.leftColumn}>
                  <View style={chatStyle.profileImage}>
                    {chat.otherUserInfo?.photoURL ? (
                      <Text style={chatStyle.profileText}>
                        {chat.otherUserInfo.name.charAt(0).toUpperCase()}
                      </Text>
                    ) : (
                      <Text style={chatStyle.profileText}>
                        {chat.otherUserInfo?.name?.charAt(0).toUpperCase() || "U"}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={chatStyle.middleColumn}>
                  <Text style={chatStyle.textName}>
                    {chat.otherUserInfo?.name || "Usuário"}
                    {chat.animalName && ` | ${chat.animalName}`}
                  </Text>
                  <Text style={chatStyle.textMessage}>
                    {chat.lastMessage?.text || "Nenhuma mensagem ainda"}
                  </Text>
                </View>
                <View style={chatStyle.rightColumn}>
                  <Text style={chatStyle.textHour}>
                    {formatTime(chat.lastMessage?.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const chatStyle = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    gap: 5,
    paddingVertical: 16,
    borderBottomColor: "#e6e7e8",
    borderBottomWidth: 1,
  },
  leftColumn: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  middleColumn: {
    flex: 5,
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: 3,
  },
  rightColumn: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#589b9b",
    justifyContent: "center",
    alignItems: "center",
  },
  profileText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  textName: {
    fontSize: 12,
    color: "#589b9b",
    fontFamily: "Roboto-Regular",
    textTransform: "uppercase",
  },
  textMessage: {
    fontSize: 14,
    color: "#757575",
    fontFamily: "Roboto-Regular",
  },
  textHour: {
    fontSize: 12,
    color: "#999",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  chatsContainer: {
    width: "100%",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#757575",
    fontFamily: "Roboto-Medium",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    fontFamily: "Roboto-Regular",
  },
});
