// src/components/learning/SessionHeader.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Card } from "../ui/Card";
import { colors, spacing } from "../../constants/theme";
import { SessionStats } from "../../types/learning";

interface Props {
  stats: SessionStats;
  limit: number;
  onEndSession: () => void;
}

export function SessionHeader({ stats, limit, onEndSession }: Props) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (stats.completed / limit) * 100;

  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Ukończone</Text>
            <Text style={styles.statValue}>
              {stats.completed}/{limit}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Poprawne</Text>
            <Text style={styles.statValue}>
              {stats.correct}/{stats.completed}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Seria</Text>
            <Text
              style={[
                styles.statValue,
                stats.streak >= 5 && styles.statHighlight,
              ]}
            >
              {stats.streak}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Punkty</Text>
            <Text style={styles.statValue}>+{stats.points}</Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Czas</Text>
            <Text style={styles.statValue}>{formatTime(stats.timeSpent)}</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        <TouchableOpacity style={styles.endButton} onPress={onEndSession}>
          <Text style={styles.endButtonText}>Zakończ sesję</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: "15%",
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },
  statHighlight: {
    color: "#F59E0B", // warning color
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6", // primary blue
  },
  endButton: {
    padding: spacing.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: 8,
  },
  endButtonText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "500",
  },
});
