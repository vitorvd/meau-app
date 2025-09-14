import React from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Option = {
  label: string;
  value: string;
};

type Props = {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
};

export default function Input({ name, control, label, placeholder }: Props) {
  return (
    <View>
        {label && (
          <Text style={style.inputLabelTitle}>{label}</Text>
        )}
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
            <TextInput
                style={style.input}
                placeholder={placeholder}
                placeholderTextColor="#ccc"
                value={value}
                onChangeText={onChange}
            />
            )}
        />
    </View>
  );
}

const style = StyleSheet.create({
  inputLabelTitle: {
    fontSize: 14,
    fontFamily: "Roboto-Regular",
    color: "#f7a800",
    paddingBottom: 1,
  },
  input: {
    outline: "none",
    fontSize: 12,
    paddingVertical: 8,
    paddingBottom: 4,
    width: "100%",
    height: 40,
    color: "#333",
    borderBottomColor: "#dfdfdfff",
    borderBottomWidth: 1,
  },
});
