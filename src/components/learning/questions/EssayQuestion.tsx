// src/components/learning/questions/EssayQuestion.tsx
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

export function EssayQuestion({ exercise, answer, onChange, disabled }: Props) {
  const wordCount = (answer || "").split(/\s+/).filter(Boolean).length;
  const minWords =
    exercise.content?.wordLimit?.min || exercise.metadata?.wordLimit?.min || 50;
  const maxWords =
    exercise.content?.wordLimit?.max || exercise.metadata?.wordLimit?.max;

  const getWordCountColor = () => {
    if (wordCount < minWords) return "#EF4444";
    if (maxWords && wordCount > maxWords) return "#F59E0B";
    return "#10B981";
  };

  return (
    <View style={styles.container}>
      {exercise.content?.thesis && (
        <View style={styles.thesisBox}>
          <Text style={styles.thesisLabel}>Temat rozprawki:</Text>
          <Text style={styles.thesisText}>{exercise.content.thesis}</Text>
        </View>
      )}

      {exercise.content?.structure && (
        <View style={styles.structureBox}>
          <Text style={styles.structureLabel}>Wymagana struktura:</Text>
          {exercise.content.structure.introduction && (
            <View style={styles.structureItem}>
              <Text style={styles.structureItemLabel}>Wstęp:</Text>
              <Text style={styles.structureItemText}>
                {exercise.content.structure.introduction}
              </Text>
            </View>
          )}
          {exercise.content.structure.arguments_for && (
            <View style={styles.structureItem}>
              <Text style={styles.structureItemLabel}>Argumenty ZA:</Text>
              <Text style={styles.structureItemText}>
                {exercise.content.structure.arguments_for}
              </Text>
            </View>
          )}
          {exercise.content.structure.conclusion && (
            <View style={styles.structureItem}>
              <Text style={styles.structureItemLabel}>Zakończenie:</Text>
              <Text style={styles.structureItemText}>
                {exercise.content.structure.conclusion}
              </Text>
            </View>
          )}
        </View>
      )}

      {exercise.content?.requirements &&
        exercise.content.requirements.length > 0 && (
          <View style={styles.requirementsBox}>
            <Text style={styles.requirementsLabel}>Wymagania:</Text>
            <View style={styles.requirementsList}>
              {exercise.content.requirements.map((req: string, idx: number) => (
                <Text key={idx} style={styles.requirementItem}>
                  • {req}
                </Text>
              ))}
            </View>
          </View>
        )}

      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        value={answer || ""}
        onChangeText={onChange}
        placeholder="Napisz wypracowanie zgodnie z wymaganiami..."
        placeholderTextColor={colors.text.tertiary}
        multiline
        numberOfLines={15}
        editable={!disabled}
      />

      <View style={styles.wordCountContainer}>
        <Text style={styles.wordCountLabel}>Liczba słów:</Text>
        <Text style={[styles.wordCount, { color: getWordCountColor() }]}>
          {wordCount}
          {minWords && maxWords && ` / ${minWords}-${maxWords}`}
        </Text>
      </View>

      {wordCount < minWords && (
        <Text style={styles.wordCountHint}>
          Jeszcze {minWords - wordCount} słów do minimum
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  thesisBox: {
    padding: spacing.md,
    backgroundColor: "#EDE9FE",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#8B5CF6",
  },
  thesisLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5B21B6",
    marginBottom: spacing.xs,
  },
  thesisText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5B21B6",
  },
  structureBox: {
    padding: spacing.md,
    backgroundColor: "#DBEAFE",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
  },
  structureLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E40AF",
    marginBottom: spacing.sm,
  },
  structureItem: {
    marginBottom: spacing.sm,
  },
  structureItemLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E40AF",
    marginBottom: 2,
  },
  structureItemText: {
    fontSize: 13,
    color: "#1E40AF",
    lineHeight: 18,
  },
  requirementsBox: {
    padding: spacing.md,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#F59E0B",
  },
  requirementsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: spacing.sm,
  },
  requirementsList: {
    gap: spacing.xs,
  },
  requirementItem: {
    fontSize: 13,
    color: "#92400E",
  },
  input: {
    borderWidth: 2,
    borderColor: colors.border.light,
    borderRadius: 8,
    padding: spacing.md,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    minHeight: 200,
    textAlignVertical: "top",
  },
  inputDisabled: {
    backgroundColor: "#F3F4F6",
    opacity: 0.6,
  },
  wordCountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  wordCountLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  wordCount: {
    fontSize: 16,
    fontWeight: "600",
  },
  wordCountHint: {
    fontSize: 12,
    color: colors.text.tertiary,
    textAlign: "right",
  },
});
