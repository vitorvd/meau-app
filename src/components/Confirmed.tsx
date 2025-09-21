import React from "react";
import { StatusBar, StyleSheet, Text, TextStyle, View } from "react-native";
import Button from "./Button";

type Prop = {
  title: string,
  text: string,
  buttonText: string,
  styleType: "yellow" | "oceanBlue";
}

export default function Confirmed({title, text, buttonText, styleType}: Prop) {
  const titleStyle: TextStyle = styleType === "yellow" ? styles.yellowTitle : styles.oceanBlueTitle

  return (
    <View style={styles.container}>
      <Text style={titleStyle}>{title}</Text>
      <Text style={styles.text}>
        {text}
      </Text>
      <Button
        text={buttonText}
        type={styleType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    alignItems: "center", 
    justifyContent: "space-evenly",
    backgroundColor: "#fafafa",
    width: "100%",
  },
  oceanBlueTitle: {
    fontSize: 53,
    fontFamily: "Courgette-Regular",
    color: "#88c9bf",
  },
  yellowTitle: {
    fontSize: 53,
    fontFamily: "Courgette-Regular",
    color: "#ffd358",
  },
  text: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: "#757575",
    textAlign: "center",
    lineHeight: 22,
    letterSpacing: 0.5
  },
});
