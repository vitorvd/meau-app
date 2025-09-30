import React from "react";
import { Image, StyleSheet, Text, TextStyle, TouchableOpacity, View } from "react-native";

type Prop = {
  text: string,
  label: string,
  styleType: "yellow" | "oceanBlue";
  onPress: () => void;
  imageUri?: string | null;
}

export default function Upload({text, label, styleType, onPress, imageUri}: Prop) {
  const textStyle: TextStyle = styleType === "yellow" ? styles.yellowText : styles.oceanBlueText

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={textStyle}>{label}</Text>
        {imageUri && <Image source={{ uri: imageUri }} /> }
      </View>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center", 
    justifyContent: "center",
    width: "100%",
  },
  labelContainer: {
    alignItems: "flex-start", 
    justifyContent: "flex-start",
    width: "100%",
  },
  uploadContainer: {
    width: 128,
    height: 128,
    borderWidth: 2,
    borderRadius: 3,
    borderColor: "#e6e7e7",
    backgroundColor: "#e6e7e7",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    marginVertical: 32,
  },
  oceanBlueText: {
    fontFamily: "Roboto-Regular",
    paddingTop: 28,
    color: "#88c9bf",
    fontSize: 14,
  },
  yellowText: {
    fontFamily: "Roboto-Regular",
    paddingTop: 28,
    color: "#ffd358",
    fontSize: 14,
  },
  text: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: "#757575",
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.5
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#f7a800', // Cor de exemplo
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
