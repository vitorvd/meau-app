import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

export type ButtonType = "gray" | "yellow" | "oceanBlue";

type Props = {
  text: string;
  type?: ButtonType;
  onPress?: () => void;
  buttonStyle?: ViewStyle;
  containerStyle?: ViewStyle;
};

function getStyleByType(type: ButtonType = "yellow") {
  const typeStyle = {
    gray: styles.grayButton,
    yellow: styles.yellowButton,
    oceanBlue: styles.oceanBlueButton,
  };

  return typeStyle[type];
}

export default function Button({
  text,
  type = "yellow",
  onPress,
  containerStyle,
  buttonStyle,
}: Props) {
  return (
    <View style={[{ alignItems: "center" }, containerStyle]}>
      <TouchableOpacity
        style={[getStyleByType(type), buttonStyle]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const baseButtonStyle: ViewStyle = {
  width: 232,
  height: 40,
  borderWidth: 2,
  borderRadius: 3,
  justifyContent: "center",
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3,
};

const styles = StyleSheet.create({
  yellowButton: {
    ...baseButtonStyle,
    backgroundColor: "#ffd358",
    borderColor: "#ffd358",
  },
  grayButton: {
    ...baseButtonStyle,
    backgroundColor: "#f1f2f2",
    borderColor: "#f1f2f2",
  },
  oceanBlueButton: {
    ...baseButtonStyle,
    borderColor: "#88c9bf",
    backgroundColor: "#88c9bf",
  },
  buttonText: {
    fontSize: 12,
    color: " rgba(67, 67, 67, 0.8)",
    textTransform: "uppercase",
    fontFamily: "Roboto-Regular",
  },
});
