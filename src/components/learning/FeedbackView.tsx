// src/components/learning/FeedbackView.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Exercise } from "../../types/learning";
import { colors, spacing } from "../../constants/theme";

interface Props {
  exercise: Exercise;
  result: any;
  answer: any;
}

export function FeedbackView({ exercise, result }: Props) {
  const isCorrect = result.score > 0;
  const feedback = result.feedback || result.assessment;

  // Dla zadań zamkniętych
  if (
    exercise.type === "CLOSED_SINGLE" ||
    exercise.type === "CLOSED_MULTIPLE"
  ) {
    return (
      <View
        style={[
          styles.container,
          isCorrect ? styles.containerSuccess : styles.containerError,
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerIcon}>{isCorrect ? "✓" : "✗"}</Text>
          <View style={styles.headerText}>
            <Text
              style={[
                styles.headerTitle,
                isCorrect ? styles.textSuccess : styles.textError,
              ]}
            >
              {isCorrect ? "Świetnie!" : "Niepoprawna odpowiedź"}
            </Text>
            <Text style={styles.score}>+{result.score} pkt</Text>
          </View>
        </View>

        {!isCorrect && feedback?.correctAnswerText && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Poprawna odpowiedź:</Text>
            <Text style={styles.sectionText}>{feedback.correctAnswerText}</Text>
          </View>
        )}

        {feedback?.explanation && (
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Wyjaśnienie:</Text>
            <Text style={styles.sectionText}>{feedback.explanation}</Text>
          </View>
        )}
      </View>
    );
  }

  // Dla zadań otwartych
  return (
    <View
      style={[
        styles.container,
        isCorrect
          ? styles.containerSuccess
          : feedback?.isPartiallyCorrect
          ? styles.containerWarning
          : styles.containerError,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.headerIcon}>
          {isCorrect ? "✓" : feedback?.isPartiallyCorrect ? "~" : "✗"}
        </Text>
        <View style={styles.headerText}>
          <Text
            style={[
              styles.headerTitle,
              isCorrect
                ? styles.textSuccess
                : feedback?.isPartiallyCorrect
                ? styles.textWarning
                : styles.textError,
            ]}
          >
            {isCorrect
              ? "Świetna odpowiedź!"
              : feedback?.isPartiallyCorrect
              ? "Częściowo poprawna odpowiedź"
              : "Niepoprawna odpowiedź"}
          </Text>
          <Text style={styles.score}>
            {result.score}/{feedback?.maxScore || exercise.points} pkt
          </Text>
        </View>
      </View>

      {feedback?.feedback && (
        <View style={styles.section}>
          <Text style={styles.sectionText}>
            {typeof feedback.feedback === "string"
              ? feedback.feedback
              : feedback.feedback.message}
          </Text>
        </View>
      )}

      {feedback?.correctElements && feedback.correctElements.length > 0 && (
        <View style={styles.successSection}>
          <Text style={styles.successSectionLabel}>✓ Poprawne elementy:</Text>
          {feedback.correctElements.map((element: string, idx: number) => (
            <Text key={idx} style={styles.listItem}>
              • {element}
            </Text>
          ))}
        </View>
      )}

      {feedback?.missingElements && feedback.missingElements.length > 0 && (
        <View style={styles.errorSection}>
          <Text style={styles.errorSectionLabel}>✗ Brakujące elementy:</Text>
          {feedback.missingElements.map((element: string, idx: number) => (
            <Text key={idx} style={styles.listItem}>
              • {element}
            </Text>
          ))}
        </View>
      )}

      {feedback?.correctAnswer && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>
            Przykładowa poprawna odpowiedź:
          </Text>
          <View style={styles.exampleBox}>
            <Text style={styles.exampleText}>{feedback.correctAnswer}</Text>
          </View>
        </View>
      )}

      {feedback?.suggestions && feedback.suggestions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Wskazówki na przyszłość:</Text>
          {feedback.suggestions.map((suggestion: string, idx: number) => (
            <Text key={idx} style={styles.listItem}>
              • {suggestion}
            </Text>
          ))}
        </View>
      )}

      {exercise.type === "ESSAY" && feedback?.detailedFeedback && (
        <View style={styles.detailsGrid}>
          {feedback.formalScore !== undefined && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Wymogi formalne:</Text>
              <Text style={styles.detailValue}>{feedback.formalScore}/1</Text>
            </View>
          )}
          {feedback.literaryScore !== undefined && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Kompetencje literackie:</Text>
              <Text style={styles.detailValue}>
                {feedback.literaryScore}/16
              </Text>
            </View>
          )}
          {feedback.compositionScore !== undefined && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Kompozycja:</Text>
              <Text style={styles.detailValue}>
                {feedback.compositionScore}/7
              </Text>
            </View>
          )}
          {feedback.languageScore !== undefined && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Styl i język:</Text>
              <Text style={styles.detailValue}>
                {feedback.languageScore}/11
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 2,
    gap: spacing.md,
  },
  containerSuccess: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981",
  },
  containerWarning: {
    backgroundColor: "#FEF3C7",
    borderColor: "#F59E0B",
  },
  containerError: {
    backgroundColor: "#FEE2E2",
    borderColor: "#EF4444",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  textSuccess: {
    color: "#059669",
  },
  textWarning: {
    color: "#D97706",
  },
  textError: {
    color: "#DC2626",
  },
  score: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },
  section: {
    gap: spacing.xs,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
  sectionText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  successSection: {
    padding: spacing.sm,
    backgroundColor: "#D1FAE5",
    borderRadius: 6,
    gap: spacing.xs,
  },
  successSectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
  },
  errorSection: {
    padding: spacing.sm,
    backgroundColor: "#FEE2E2",
    borderRadius: 6,
    gap: spacing.xs,
  },
  errorSectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
  },
  listItem: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  exampleBox: {
    padding: spacing.sm,
    backgroundColor: "#DBEAFE",
    borderRadius: 6,
  },
  exampleText: {
    fontSize: 13,
    color: "#1E40AF",
    lineHeight: 18,
  },
  detailsGrid: {
    gap: spacing.sm,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
});
