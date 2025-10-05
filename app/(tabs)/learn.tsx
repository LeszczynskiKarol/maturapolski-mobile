// app/(tabs)/learn.tsx
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "../../src/components/ui/Button";
import { Card } from "../../src/components/ui/Card";
import { colors, spacing } from "../../src/constants/theme";

export default function LearnScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Nauka</Text>
        <Text style={styles.subtitle}>Tutaj będą sesje nauki i ćwiczenia</Text>
      </View>

      <Card padding="large">
        <Text style={styles.cardTitle}>🚧 W budowie</Text>
        <Text style={styles.cardText}>
          Ten ekran jest obecnie w przygotowaniu. Wkrótce znajdziesz tutaj:
        </Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>• Sesje nauki adaptacyjnej</Text>
          <Text style={styles.featureItem}>• Ćwiczenia z różnych epok</Text>
          <Text style={styles.featureItem}>• Testy i quizy</Text>
          <Text style={styles.featureItem}>• Wyjaśnienia i podpowiedzi</Text>
        </View>
        <Button
          title="Wróć do Dashboard"
          onPress={() => {}}
          variant="primary"
          fullWidth
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
  cardTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  cardText: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 24,
  },
  featureList: {
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  featureItem: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
