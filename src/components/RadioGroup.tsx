import React from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { RadioButton } from "react-native-paper";

type Option = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  control: any;
  label: string;
  options: Option[];
};

export default function RadioGroup({ name, control, label, options }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <RadioButton.Group onValueChange={onChange} value={value}>
            <View style={styles.optionsRow}>
              {options.map((opt) => (
                <View key={opt.value} style={styles.option}>
                  <RadioButton value={opt.value} />
                  <Text>{opt.label}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
  },
  label: {
    fontSize: 14,
    fontFamily: "Roboto-Regular", 
    color: "#f7a800",
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
});
