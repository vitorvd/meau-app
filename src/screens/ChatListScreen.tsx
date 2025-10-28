import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatListScreen() {
  // Exemplo de chats estáticos
  const chats = [
    { name: "Vitor Versiani | Brisa", message: "Ela é flamenguista!", hour: "19:30" },
    { name: "Ana Clara | Luna", message: "Oi, tudo bem?", hour: "18:20" },
    { name: "Carlos Eduardo | Max", message: "Vamos marcar?", hour: "17:15" },
    { name: "Juliana | Bela", message: "Obrigada pelo carinho!", hour: "16:05" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.chatsContainer}>
          {chats.map((chat, index) => (
            <TouchableOpacity key={index} style={chatStyle.rowContainer}>
              <View style={chatStyle.leftColumn}>
                <View style={chatStyle.profileImage} />
              </View>
              <View style={chatStyle.middleColumn}>
                <Text style={chatStyle.textName}>{chat.name}</Text>
                <Text style={chatStyle.textMessage}>{chat.message}</Text>
              </View>
              <View style={chatStyle.rightColumn}>
                <Text style={chatStyle.textHour}>{chat.hour}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
    backgroundColor: "red",
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
});
