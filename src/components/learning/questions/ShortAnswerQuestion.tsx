// src/components/learning/questions/ShortAnswerQuestion.tsx
import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Exercise } from "../../../types/learning";
import { colors, spacing } from "../../../constants/theme";

interface Props {
  exercise: Exercise;
  answer: string;
  onChange: (answer: string) => void;
  disabled: boolean;
}

export function ShortAnswerQuestion({
  exercise,
  answer,
  onChange,
  disabled,
}: Props) {
  return (
    <View style={styles.container}>
      {exercise.content?.instruction && (
        <View style={styles.instructionBox}>
          <Text style={styles.instructionLabel}>Polecenie:</Text>
          <Text style={styles.instructionText}>
            {exercise.content.instruction}
          </Text>
        </View>
      )}

      {exercise.content?.phrase && (
        <View style={styles.phraseBox}>
          <Text style={styles.phraseLabel}>Frazeologizm:</Text>
          <Text style={styles.phraseText}>"{exercise.content.phrase}"</Text>
        </View>
      )}

      {exercise.content?.work && (
        <View style={styles.workBox}>
          <Text style={styles.workLabel}>Dzieło literackie:</Text>
          <Text style={styles.workText}>{exercise.content.work}</Text>
        </View>
      )}

      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        value={answer || ""}
        onChangeText={onChange}
        placeholder="Wpisz swoją odpowiedź..."
        placeholderTextColor={colors.text.tertiary}
        multiline
        numberOfLines={4}
        editable={!disabled}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  instructionBox: {
    padding: spacing.md,
    backgroundColor: "#DBEAFE",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  instructionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E40AF",
    marginBottom: spacing.xs,
  },
  instructionText: {
    fontSize: 14,
    color: "#1E40AF",
    lineHeight: 20,
  },
  phraseBox: {
    padding: spacing.md,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  phraseLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: spacing.xs,
  },
  phraseText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
  },
  workBox: {
    padding: spacing.md,
    backgroundColor: "#EDE9FE",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#8B5CF6",
  },
  workLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5B21B6",
    marginBottom: spacing.xs,
  },
  workText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5B21B6",
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border.light,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    minHeight: 100,
    textAlignVertical: "top",
  },
  inputDisabled: {
    backgroundColor: "#F3F4F6",
    opacity: 0.6,
  },
});
