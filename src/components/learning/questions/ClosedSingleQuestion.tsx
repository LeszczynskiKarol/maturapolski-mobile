// src/components/learning/questions/ClosedSingleQuestion.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Exercise } from "../../../types/learning";
import { colors, spacing } from "../../../constants/theme";

interface Props {
  exercise: Exercise;
  answer: number | null;
  onChange: (answer: number) => void;
  disabled: boolean;
}

export function ClosedSingleQuestion({
  exercise,
  answer,
  onChange,
  disabled,
}: Props) {
  const options = exercise.content?.options || [];

  return (
    <View style={styles.container}>
      {exercise.content?.text && (
        <View style={styles.textBox}>
          <Text style={styles.text}>{exercise.content.text}</Text>
        </View>
      )}

      <View style={styles.options}>
        {options.map((option: string, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              answer === index && styles.optionSelected,
              disabled && styles.optionDisabled,
            ]}
            onPress={() => !disabled && onChange(index)}
            disabled={disabled}
          >
            <View style={styles.radio}>
              {answer === index && <View style={styles.radioSelected} />}
            </View>
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  textBox: {
    padding: spacing.md,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  text: {
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 22,
  },
  options: {
    gap: spacing.sm,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderWidth: 2,
    borderColor: colors.border.light,
    borderRadius: 8,
    backgroundColor: colors.background.primary,
  },
  optionSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#EFF6FF",
  },
  optionDisabled: {
    opacity: 0.6,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border.medium,
    marginRight: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  radioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3B82F6",
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    lineHeight: 20,
  },
});
