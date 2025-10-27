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

  const textStyle: TextStyle = styleType === "yellow" ? styles.yellowText : styles.oceanBlueText;

  const buttonStyle = styleType === "yellow" ? styles.yellowButton : styles.oceanBlueButton;

  return (
    <View style={styles.container}>
      <Text style={[styles.label, textStyle]}>{label}</Text>
      <View style={styles.previewContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} />
        ) : (
          <Text style={styles.placeholderText}>A foto aparecerá aqui</Text>
        )}
      </View>
      <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center", 
    marginVertical: 15,
  },
  label: {
    width: "100%",
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    marginBottom: 8,
  },
  
  oceanBlueText: {
    color: "#88c9bf",
  },
  yellowText: {
    color: "#ffd358",
  },
  previewContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: "#757575",
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  yellowButton: {
    backgroundColor: '#f7a800',
  },
  oceanBlueButton: {
    backgroundColor: '#88c9bf',
  },
});