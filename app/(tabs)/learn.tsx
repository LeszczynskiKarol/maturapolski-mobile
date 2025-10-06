// app/(tabs)/learn.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLearningSession } from "../../src/hooks/useLearningSession";
import { colors, spacing } from "../../src/constants/theme";
import { SessionHeader } from "../../src/components/learning/SessionHeader";
import { ExerciseView } from "../../src/components/learning/ExerciseView";
import { SessionStart } from "../../src/components/learning/SessionStart";
import { SessionComplete } from "../../src/components/learning/SessionComplete";

export default function LearnScreen() {
  const session = useLearningSession();

  const handleStartSession = async () => {
    try {
      await session.startSession();
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się rozpocząć sesji");
    }
  };

  const handleSubmit = async () => {
    try {
      await session.submitAnswer();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Nie udało się wysłać odpowiedzi";
      Alert.alert("Błąd", errorMessage);
    }
  };

  const handleSkip = () => {
    Alert.alert("Pomiń zadanie", "Czy na pewno chcesz pominąć to zadanie?", [
      { text: "Anuluj", style: "cancel" },
      { text: "Pomiń", onPress: session.skipExercise, style: "destructive" },
    ]);
  };

  const handleEndSession = () => {
    Alert.alert(
      "Zakończ sesję",
      session.stats.completed > 0
        ? `Ukończyłeś ${session.stats.completed} zadań. Czy chcesz zakończyć sesję?`
        : "Czy na pewno chcesz zakończyć sesję?",
      [
        { text: "Kontynuuj", style: "cancel" },
        {
          text: "Zakończ",
          onPress: async () => {
            await session.endSession();
          },
          style: "destructive",
        },
      ]
    );
  };

  if (session.isLoading && !session.currentExercise) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Ładowanie zadania...</Text>
      </View>
    );
  }

  if (session.sessionComplete) {
    return (
      <SessionComplete
        stats={session.stats}
        onNewSession={handleStartSession}
      />
    );
  }

  if (!session.sessionActive) {
    return <SessionStart onStart={handleStartSession} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {session.currentExercise && (
          <ExerciseView
            exercise={session.currentExercise}
            answer={session.answer}
            onAnswerChange={session.setAnswer}
            showFeedback={session.showFeedback}
            submissionResult={session.submissionResult}
            onSubmit={handleSubmit}
            onNext={session.nextExercise}
            onSkip={handleSkip}
            isLoading={session.isLoading}
          />
        )}
      </ScrollView>
      <SessionHeader
        stats={session.stats}
        limit={session.SESSION_LIMIT}
        onEndSession={handleEndSession}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: 16,
    color: colors.text.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
});
