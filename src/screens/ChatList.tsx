import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../components/Button";

export default function ChatListScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.chatsContainer}>
          <Chat/>
          <Chat/>
          <Chat/>
          <Chat/>
        </View>

        <Button
          text="Finalizar um Processo"
          type="oceanBlue"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function Chat() {
  return (
    <View style={chatStyle.rowContainer}>
      <View style={chatStyle.leftColumn}>
        <View style={chatStyle.profileImage} />
      </View>

      <View style={chatStyle.middleColumn}>
        <Text style={chatStyle.textName}>Vitor Versiani | Brisa</Text>
        <Text style={chatStyle.textMessage}>Ela é flamenguista!</Text>
      </View>

      <View style={chatStyle.rightColumn}>
        <Text style={chatStyle.textHour}>19:30</Text>
      </View>
    </View>
  )
}

const chatStyle = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-start",
    gap: 5,
    paddingVertical: 16,
    borderBottomColor: "#e6e7e8",
    borderBottomWidth: 1
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
