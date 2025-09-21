import React from "react";
import { Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { Checkbox } from "react-native-paper";

type Option = {
  label: string;
  value: string;
  extraComponent?: React.ReactNode;
};

type Props = {
  name: string;
  control: any;
  label?: string;
  options: Option[];
  rules?: object;
  errors?: Record<string, any>;
};

export default function CheckboxGroup({ name, control, label, options, rules, errors }: Props) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}

      <Controller
        control={control}
        name={name}
        defaultValue={[]}
        rules={rules}
        render={({ field: { onChange, value } }) => {
          const toggleValue = (val: string) => {
            if (value?.includes(val)) {
              onChange(value.filter((v: string) => v !== val));
            } else {
              onChange([...(value || []), val]);
            }
          };

          return (
            <View style={styles.optionsRow}>
              {options.map((opt) => {
                const isChecked = value?.includes(opt.value);
                return (
                  <View key={opt.value} style={styles.optionContainer}>
                    <View style={styles.option}>
                      <Checkbox
                        status={isChecked ? "checked" : "unchecked"}
                        onPress={() => toggleValue(opt.value)}
                      />
                      <Text>{opt.label}</Text>
                    </View>

                    {isChecked && opt.extraComponent && (
                      <View style={styles.extraContainer}>{opt.extraComponent}</View>
                    )}

                    {errors?.[name] && (
                      <Text style={styles.errorText}>{errors[name]?.message}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          );
        }}
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
    flexDirection: "column",
    flexWrap: "wrap",
  },
  optionContainer: {
    marginBottom: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
  },
  extraContainer: {
    marginLeft: 32,
    marginTop: 4,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
});
