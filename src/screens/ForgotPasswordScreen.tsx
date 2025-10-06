// src/screens/ForgotPasswordScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { colors, spacing } from "../constants/theme";
import { api } from "../services/api";

const MailIcon = () => <Text style={styles.icon}>📧</Text>;
const LockIcon = () => <Text style={styles.icon}>🔒</Text>;

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setEmailError("");

    if (!email) {
      setEmailError("Email jest wymagany");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Nieprawidłowy adres email");
      return;
    }

    setIsLoading(true);

    try {
      // W mobile nie mamy reCAPTCHA, więc backend musi to obsłużyć
      await api.post("/api/auth/request-password-reset", {
        email,
        recaptchaToken: "MOBILE_DEV", // Backend powinien to zignorować dla mobile
      });

      Alert.alert(
        "Sprawdź swoją skrzynkę!",
        `Jeśli konto o adresie ${email} istnieje, wysłaliśmy instrukcję resetu hasła.\n\nEmail może trafić do folderu spam. Link będzie ważny przez 1 godzinę.`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error("Password reset request error:", error);

      // Zawsze pokazuj sukces dla bezpieczeństwa
      Alert.alert(
        "Email wysłany",
        "Jeśli konto istnieje, otrzymasz instrukcję resetu hasła.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={["#dbeafe", "#e0e7ff", "#ffffff"]}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <LockIcon />
              <Text style={styles.title}>Zapomniałeś hasła?</Text>
              <Text style={styles.subtitle}>
                Wyślemy Ci link do zresetowania hasła
              </Text>
            </View>

            {/* Formularz */}
            <Card style={styles.formCard}>
              <Input
                label="Adres email"
                placeholder="jan@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError("");
                }}
                autoCapitalize="none"
                keyboardType="email-address"
                icon={<MailIcon />}
                error={emailError}
              />

              <Button
                title="Wyślij link resetujący"
                onPress={handleSubmit}
                loading={isLoading}
                fullWidth
                size="large"
              />

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  💡 Link do resetu będzie ważny przez 1 godzinę
                </Text>
              </View>
            </Card>

            {/* Link powrotu */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backText}>← Wróć do logowania</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  content: {
    maxWidth: 500,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  infoBox: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 8,
    marginTop: spacing.md,
  },
  infoText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: "center",
  },
  backButton: {
    alignItems: "center",
    padding: spacing.sm,
  },
  backText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
});
