// src/components/ui/Card.tsx
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { borderRadius, colors, shadows, spacing } from "../../constants/theme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: "none" | "small" | "medium" | "large";
  shadow?: "none" | "small" | "medium" | "large";
}

// Mapowanie shadow prop na klucze w shadows
const shadowMap = {
  none: undefined,
  small: shadows.sm,
  medium: shadows.md,
  large: shadows.lg,
};

export const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = "medium",
  shadow = "medium",
}) => {
  return (
    <View
      style={[
        styles.card,
        padding !== "none" && styles[`padding_${padding}`],
        shadowMap[shadow],
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  padding_small: {
    padding: spacing.sm,
  },
  padding_medium: {
    padding: spacing.md,
  },
  padding_large: {
    padding: spacing.lg,
  },
});
