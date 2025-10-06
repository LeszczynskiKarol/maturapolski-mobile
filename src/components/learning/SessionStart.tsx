// src/components/learning/SessionStart.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { colors, spacing } from "../../constants/theme";

interface Props {
  onStart: () => void;
}

export function SessionStart({ onStart }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Zaczynajmy dzisiejszą naukę!</Text>
        <Text style={styles.heroSubtitle}>
          System dopasuje zadania do Twojego poziomu i postępów. Sesja zawiera
          20 zadań.
        </Text>
      </View>

      <Card padding="large">
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Co znajdziesz w sesji:</Text>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🎯</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Adaptacyjny dobór zadań</Text>
              <Text style={styles.featureDescription}>
                Pytania dostosowane do Twojego poziomu
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🔥</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>System serii</Text>
              <Text style={styles.featureDescription}>
                Utrzymuj passę poprawnych odpowiedzi
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>🤖</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Ocena AI</Text>
              <Text style={styles.featureDescription}>
                Szczegółowy feedback dla zadań otwartych
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Text style={styles.featureIcon}>📊</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Śledzenie postępów</Text>
              <Text style={styles.featureDescription}>
                Zobacz swoje statystyki w czasie rzeczywistym
              </Text>
            </View>
          </View>
        </View>

        <Button
          title="Rozpocznij sesję nauki (20 zadań)"
          onPress={onStart}
          variant="primary"
          fullWidth
          icon={<Text>▶</Text>}
        />
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
  hero: {
    padding: spacing.xl,
    backgroundColor: "#3B82F6",
    borderRadius: 16,
    marginBottom: spacing.lg,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#DBEAFE",
    lineHeight: 24,
  },
  features: {
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
  },
  feature: {
    flexDirection: "row",
    gap: spacing.md,
  },
  featureIcon: {
    fontSize: 32,
  },
  featureText: {
    flex: 1,
    gap: spacing.xs,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
  featureDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
