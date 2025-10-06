// src/components/learning/ExerciseView.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { colors, spacing } from "../../constants/theme";
import { Exercise } from "../../types/learning";
import { ClosedSingleQuestion } from "./questions/ClosedSingleQuestion";
import { ClosedMultipleQuestion } from "./questions/ClosedMultipleQuestion";
import { ShortAnswerQuestion } from "./questions/ShortAnswerQuestion";
import { EssayQuestion } from "./questions/EssayQuestion";
import { FeedbackView } from "./FeedbackView";

interface Props {
  exercise: Exercise;
  answer: any;
  onAnswerChange: (answer: any) => void;
  showFeedback: boolean;
  submissionResult: any;
  onSubmit: () => void;
  onNext: () => void;
  onSkip: () => void;
  isLoading: boolean;
}

export function ExerciseView({
  exercise,
  answer,
  onAnswerChange,
  showFeedback,
  submissionResult,
  onSubmit,
  onNext,
  onSkip,
  isLoading,
}: Props) {
  const canSubmit = () => {
    if (!answer) return false;

    switch (exercise.type) {
      case "CLOSED_SINGLE":
        return answer !== null && answer !== undefined;
      case "CLOSED_MULTIPLE":
        return Array.isArray(answer) && answer.length > 0;
      case "SHORT_ANSWER":
      case "SYNTHESIS_NOTE":
        return typeof answer === "string" && answer.trim().length > 0;
      case "ESSAY":
        const wordCount = (answer || "").split(/\s+/).filter(Boolean).length;
        const minWords = exercise.content?.wordLimit?.min || 50;
        return wordCount >= minWords;
      default:
        return false;
    }
  };

  const renderQuestion = () => {
    switch (exercise.type) {
      case "CLOSED_SINGLE":
        return (
          <ClosedSingleQuestion
            exercise={exercise}
            answer={answer}
            onChange={onAnswerChange}
            disabled={showFeedback}
          />
        );
      case "CLOSED_MULTIPLE":
        return (
          <ClosedMultipleQuestion
            exercise={exercise}
            answer={answer}
            onChange={onAnswerChange}
            disabled={showFeedback}
          />
        );
      case "SHORT_ANSWER":
      case "SYNTHESIS_NOTE":
        return (
          <ShortAnswerQuestion
            exercise={exercise}
            answer={answer}
            onChange={onAnswerChange}
            disabled={showFeedback}
          />
        );
      case "ESSAY":
        return (
          <EssayQuestion
            exercise={exercise}
            answer={answer}
            onChange={onAnswerChange}
            disabled={showFeedback}
          />
        );
      default:
        return null;
    }
  };

  const getDifficultyStars = () => {
    return "⭐".repeat(exercise.difficulty);
  };

  return (
    <Card padding="large">
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{exercise.category}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{getDifficultyStars()}</Text>
          </View>
          <Text style={styles.points}>{exercise.points} pkt</Text>
        </View>

        <Text style={styles.question}>{exercise.question}</Text>
      </View>

      {/* Question content */}
      {!showFeedback && <View style={styles.content}>{renderQuestion()}</View>}

      {/* Feedback */}
      {showFeedback && submissionResult && (
        <FeedbackView
          exercise={exercise}
          result={submissionResult}
          answer={answer}
        />
      )}

      {/* Actions */}
      <View style={styles.actions}>
        {!showFeedback ? (
          <>
            <Button
              title="Pomiń"
              onPress={onSkip}
              variant="secondary"
              style={styles.skipButton}
            />
            <Button
              title="Sprawdź"
              onPress={onSubmit}
              variant="primary"
              disabled={!canSubmit() || isLoading}
              loading={isLoading}
              style={styles.submitButton}
            />
          </>
        ) : (
          <Button
            title="Następne zadanie"
            onPress={onNext}
            variant="primary"
            fullWidth
          />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.lg,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: "#DBEAFE",
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: "#1E40AF",
    fontWeight: "500",
  },
  points: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    lineHeight: 26,
  },
  content: {
    marginBottom: spacing.lg,
  },
  actions: {
    flexDirection: "row",
    gap: spacing.md,
  },
  skipButton: {
    flex: 1,
  },
  submitButton: {
    flex: 2,
  },
});
