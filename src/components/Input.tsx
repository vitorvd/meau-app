import React from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  name: string;
  control: any;
  label?: string;
  placeholder?: string;
  rules?: object;
  secureTextEntry?: boolean;
  errors?: Record<string, any>;
};

export default function Input({
  name,
  control,
  label,
  placeholder,
  rules,
  secureTextEntry,
  errors,
}: Props) {
  return (
    <View style={{ width: "100%" }}>
      {label && <Text style={style.inputLabelTitle}>{label}</Text>}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={[
                style.input,
                errors?.[name] && { borderBottomColor: "red" },
              ]}
              placeholder={placeholder}
              placeholderTextColor="#ccc"
              value={value}
              onChangeText={onChange}
              secureTextEntry={secureTextEntry}
            />
            {errors?.[name] && (
              <Text style={style.errorText}>{errors[name]?.message}</Text>
            )}
          </>
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
    borderBottomColor: "#dfdfdf",
    borderBottomWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
});
