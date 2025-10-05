// src/screens/DashboardScreen.tsx
import { useQuery } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card } from "../components/ui/Card";
import { borderRadius, colors, spacing } from "../constants/theme";
import { api } from "../services/api";
import { useAuthStore } from "../store/authStore";

// Ikony (emoji placeholders)
const FlameIcon = () => <Text style={styles.emoji}>🔥</Text>;
const TargetIcon = () => <Text style={styles.emoji}>🎯</Text>;
const TrophyIcon = () => <Text style={styles.emoji}>🏆</Text>;
const BookIcon = () => <Text style={styles.emoji}>📚</Text>;
const PlayIcon = () => <Text style={styles.emoji}>▶️</Text>;
const RepeatIcon = () => <Text style={styles.emoji}>🔄</Text>;

export default function DashboardScreen() {
  const user = useAuthStore((state) => state.user);

  const { data: stats } = useQuery({
    queryKey: ["learning-stats"],
    queryFn: () => api.get("/api/learning/stats").then((r) => r.data),
  });

  const { data: levelProgress } = useQuery({
    queryKey: ["difficulty-progress"],
    queryFn: () =>
      api.get("/api/learning/difficulty-progress").then((r) => r.data),
  });

  const greeting = () => {
    const hour = new Date().getHours();
    const username = user?.username || "User";

    if (hour < 12) return `Dzień dobry, ${username}`;
    if (hour < 18) return `Witaj, ${username}`;
    return `Dobry wieczór, ${username}`;
  };

  const startLearning = () => {
    router.push("/(tabs)/learn");
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting()}</Text>
        <Text style={styles.subtitle}>Zaczynajmy dzisiejszą naukę!</Text>
      </View>

      {/* Main CTA */}
      <TouchableOpacity onPress={startLearning} activeOpacity={0.8}>
        <Card style={styles.ctaCard} padding="large" shadow="large">
          <LinearGradient
            colors={[colors.primary.blue, colors.primary.purple]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <View style={styles.ctaContent}>
              <View style={styles.ctaText}>
                <Text style={styles.ctaTitle}>Rozpocznij naukę</Text>
                <Text style={styles.ctaSubtitle}>
                  Sesja adaptacyjna dostosowana do Twojego poziomu
                </Text>
                <View style={styles.ctaFeatures}>
                  <Text style={styles.ctaFeature}>✓ 20 zadań</Text>
                  <Text style={styles.ctaFeature}>✓ Inteligentny dobór</Text>
                  <Text style={styles.ctaFeature}>
                    ✓ Poziomy 1-{levelProgress?.currentMaxDifficulty || 2}
                  </Text>
                </View>
              </View>
              <View style={styles.ctaIcon}>
                <PlayIcon />
              </View>
            </View>
          </LinearGradient>
        </Card>
      </TouchableOpacity>

      {/* Quick Stats */}
      <View style={styles.statsGrid}>
        <StatCard
          icon={<FlameIcon />}
          label="Twoja passa"
          value={`${stats?.streak || 0} dni`}
          subtitle={stats?.streak > 0 ? "Trzymaj tempo!" : "Zacznij dziś!"}
          colors={["#fff7ed", "#fed7aa"]}
        />
        <StatCard
          icon={<TargetIcon />}
          label="Dzisiaj"
          value={`${stats?.todayExercises || 0}`}
          subtitle="zadań"
          colors={["#eff6ff", "#bfdbfe"]}
        />
        <StatCard
          icon={<TrophyIcon />}
          label="Max poziom"
          value={`${levelProgress?.currentMaxDifficulty || 1}`}
          subtitle="trudności"
          colors={["#faf5ff", "#e9d5ff"]}
        />
      </View>

      {/* Progress Card */}
      <Card style={styles.progressCard} padding="large">
        <View style={styles.progressHeader}>
          <Text style={styles.cardTitle}>Twój postęp</Text>
        </View>
        <View style={styles.progressContent}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Poziom trudności</Text>
            <Text style={styles.progressValue}>
              {levelProgress?.currentMaxDifficulty || 1}/5
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${levelProgress?.nextLevelProgress || 0}%`,
                },
              ]}
            />
          </View>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>
              Do poziomu {levelProgress?.nextLevel || 2}
            </Text>
            <Text style={styles.progressValue}>
              {levelProgress?.pointsNeeded || 100} pkt
            </Text>
          </View>
        </View>
      </Card>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Szybkie akcje</Text>
      <View style={styles.actionsGrid}>
        <ActionCard
          icon={<RepeatIcon />}
          title="Powtórki"
          subtitle="Z epok"
          onPress={() => router.push("/epoch-review")}
        />
        <ActionCard
          icon={<BookIcon />}
          title="Historia"
          subtitle="Sesji"
          onPress={() => router.push("/sessions")}
        />
      </View>

      {/* Recent Sessions */}
      {stats?.recentSessions && stats.recentSessions.length > 0 && (
        <View style={styles.sessionsSection}>
          <View style={styles.sessionHeader}>
            <Text style={styles.sectionTitle}>Ostatnie sesje</Text>
            <TouchableOpacity onPress={() => router.push("/sessions")}>
              <Text style={styles.seeMore}>Zobacz więcej →</Text>
            </TouchableOpacity>
          </View>
          {stats.recentSessions.slice(0, 3).map((session: any, idx: number) => (
            <Card key={idx} style={styles.sessionCard} padding="medium">
              <View style={styles.sessionContent}>
                <View style={styles.sessionIcon}>
                  <BookIcon />
                </View>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionDate}>{session.date}</Text>
                  <Text style={styles.sessionStats}>
                    {session.completed} zadań • {session.correctRate}%
                    poprawnych
                  </Text>
                </View>
                <View style={styles.sessionPoints}>
                  <Text style={styles.pointsValue}>+{session.points}</Text>
                  <Text style={styles.pointsLabel}>pkt</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// StatCard Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  colors: [string, string];
}> = ({ icon, label, value, subtitle, colors: gradientColors }) => (
  <Card style={styles.statCard} padding="medium">
    <LinearGradient
      colors={gradientColors}
      style={styles.statGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.statIcon}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </LinearGradient>
  </Card>
);

// ActionCard Component
const ActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress: () => void;
}> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <Card style={styles.actionCard} padding="medium">
      <View style={styles.actionIcon}>{icon}</View>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </Card>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  ctaCard: {
    marginBottom: spacing.lg,
    overflow: "hidden",
  },
  ctaGradient: {
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  ctaContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ctaText: {
    flex: 1,
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.white,
    marginBottom: spacing.xs,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: spacing.sm,
  },
  ctaFeatures: {
    gap: spacing.xs,
  },
  ctaFeature: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },
  ctaIcon: {
    marginLeft: spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    overflow: "hidden",
  },
  statGradient: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: "center",
  },
  statIcon: {
    marginBottom: spacing.xs,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: colors.text.tertiary,
    textAlign: "center",
  },
  progressCard: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },
  progressContent: {
    gap: spacing.sm,
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary.blue,
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  actionCard: {
    flex: 1,
    alignItems: "center",
  },
  actionIcon: {
    marginBottom: spacing.xs,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  sessionsSection: {
    marginBottom: spacing.lg,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  seeMore: {
    fontSize: 14,
    color: colors.primary.blue,
    fontWeight: "500",
  },
  sessionCard: {
    marginBottom: spacing.sm,
  },
  sessionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDate: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 2,
  },
  sessionStats: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  sessionPoints: {
    alignItems: "flex-end",
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.success,
  },
  pointsLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  emoji: {
    fontSize: 32,
  },
});
