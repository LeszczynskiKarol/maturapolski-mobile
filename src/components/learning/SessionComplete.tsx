// src/components/learning/SessionComplete.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { colors, spacing } from "../../constants/theme";
import { SessionStats } from "../../types/learning";

interface Props {
  stats: SessionStats;
  onNewSession: () => void;
}

export function SessionComplete({ stats, onNewSession }: Props) {
  const accuracy =
    stats.completed > 0
      ? Math.round((stats.correct / stats.completed) * 100)
      : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getGrade = () => {
    if (accuracy >= 90)
      return { emoji: "🏆", text: "Doskonale!", color: "#10B981" };
    if (accuracy >= 75)
      return { emoji: "🌟", text: "Świetnie!", color: "#3B82F6" };
    if (accuracy >= 60)
      return { emoji: "👍", text: "Dobrze!", color: "#F59E0B" };
    return { emoji: "💪", text: "Tak trzymaj!", color: "#EF4444" };
  };

  const grade = getGrade();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card padding="large">
        <View style={styles.header}>
          <Text style={styles.emoji}>{grade.emoji}</Text>
          <Text style={[styles.title, { color: grade.color }]}>
            {grade.text}
          </Text>
          <Text style={styles.subtitle}>Sesja ukończona!</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.mainStat}>
            <Text style={styles.mainStatValue}>{accuracy}%</Text>
            <Text style={styles.mainStatLabel}>Skuteczność</Text>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Ukończone</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.correct}</Text>
              <Text style={styles.statLabel}>Poprawne</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.maxStreak}</Text>
              <Text style={styles.statLabel}>Maks seria</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>+{stats.points}</Text>
              <Text style={styles.statLabel}>Punkty</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {formatTime(stats.timeSpent)}
              </Text>
              <Text style={styles.statLabel}>Czas</Text>
            </View>
          </View>
        </View>

        {stats.maxStreak >= 5 && (
          <View style={styles.achievement}>
            <Text style={styles.achievementIcon}>🔥</Text>
            <View style={styles.achievementText}>
              <Text style={styles.achievementTitle}>Gorąca passa!</Text>
              <Text style={styles.achievementDescription}>
                Osiągnąłeś serię {stats.maxStreak} poprawnych odpowiedzi!
              </Text>
            </View>
          </View>
        )}

        <View style={styles.actions}>
          <Button
            title="Nowa sesja"
            onPress={onNewSession}
            variant="primary"
            fullWidth
          />
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 18,
    color: colors.text.secondary,
  },
  statsContainer: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  mainStat: {
    alignItems: "center",
    padding: spacing.lg,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
  },
  mainStatValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#3B82F6",
    marginBottom: spacing.xs,
  },
  mainStatLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: "30%",
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 8,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: "center",
  },
  achievement: {
    flexDirection: "row",
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: "#FEF3C7",
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementText: {
    flex: 1,
    gap: spacing.xs,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#92400E",
  },
  achievementDescription: {
    fontSize: 14,
    color: "#92400E",
    lineHeight: 20,
  },
  actions: {
    gap: spacing.md,
  },
});
