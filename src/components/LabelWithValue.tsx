import { StyleSheet, Text, View } from "react-native";

interface LabelWithValueProps {
  label: string;
  value: string;
}

export default function LabelWithValue({label, value}: LabelWithValueProps) {
  return (
    <View style={[{flexDirection: "column", gap: 10}]}>
      <Text style={styles.yellowText}>{label}</Text>
      <Text style={styles.grayText}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    color: "#434343",
    fontFamily: "Roboto-Medium",
    letterSpacing: 0.5
  },
  yellowText: {
    textTransform: "uppercase",
    fontSize: 12,
    color: "#f7a800",
    fontFamily: "Roboto-Regular",
    letterSpacing: 0.5
  },
  grayText: {
    textTransform: "uppercase",
    fontSize: 12,
    color: "rgba(67, 67, 67, 0.8)",
    fontFamily: "Roboto-Regular",
    letterSpacing: 0.5
  }
});