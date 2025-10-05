// app/(tabs)/progress.tsx
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "../../src/components/ui/Card";
import { colors, spacing } from "../../src/constants/theme";
import { api } from "../../src/services/api";

export default function ProgressScreen() {
  const { data: stats } = useQuery({
    queryKey: ["learning-stats"],
    queryFn: () => api.get("/api/learning/stats").then((r) => r.data),
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Twoje postępy</Text>
        <Text style={styles.subtitle}>Śledź swój rozwój i osiągnięcia</Text>
      </View>

      {/* Ogólne statystyki */}
      <Card padding="large" style={styles.card}>
        <Text style={styles.cardTitle}>📊 Statystyki</Text>
        <View style={styles.statsGrid}>
          <StatItem
            label="Rozwiązane zadania"
            value={stats?.totalExercises || 0}
          />
          <StatItem label="Sesje nauki" value={stats?.totalSessions || 0} />
          <StatItem
            label="Poprawne odpowiedzi"
            value={`${stats?.correctRate || 0}%`}
          />
          <StatItem
            label="Średnia punktów/sesja"
            value={stats?.avgPoints || 0}
          />
        </View>
      </Card>

      {/* Passa */}
      <Card padding="large" style={styles.card}>
        <Text style={styles.cardTitle}>🔥 Twoja passa</Text>
        <View style={styles.streakContainer}>
          <Text style={styles.streakValue}>{stats?.streak || 0}</Text>
          <Text style={styles.streakLabel}>dni z rzędu</Text>
        </View>
        <Text style={styles.streakText}>
          {stats?.streak > 0
            ? "Świetnie! Wróć jutro, aby kontynuować passę."
            : "Zacznij dziś, aby rozpocząć swoją passę nauki!"}
        </Text>
      </Card>

      {/* Placeholder dla dalszych funkcji */}
      <Card padding="large" style={styles.card}>
        <Text style={styles.cardTitle}>🚧 Wkrótce dostępne</Text>
        <Text style={styles.cardText}>
          • Szczegółowe wykresy postępów{"\n"}• Analiza mocnych i słabych stron
          {"\n"}• Historia sesji z detalami{"\n"}• Ranking i porównanie z innymi
          {"\n"}• Osiągnięcia i odznaki
        </Text>
      </Card>
    </ScrollView>
  );
}

const StatItem = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  cardText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    padding: spacing.md,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.primary.blue,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: "center",
  },
  streakContainer: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  streakValue: {
    fontSize: 48,
    fontWeight: "700",
    color: colors.orange,
  },
  streakLabel: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  streakText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
