// src/screens/VerifyEmailScreen.tsx
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { colors, spacing } from "../constants/theme";
import { api } from "../services/api";
import { useAuthStore } from "../store/authStore";

const MailIcon = () => <Text style={styles.icon}>📧</Text>;

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams();
  const email = params.email as string;

  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const setAuth = useAuthStore((state) => state.setAuth);

  // Auto-submit po wpisaniu 6 cyfr
  useEffect(() => {
    const fullCode = code.join("");
    if (fullCode.length === 6 && !isVerifying) {
      handleVerify(fullCode);
    }
  }, [code]);

  const handleVerify = async (verificationCode: string) => {
    setIsVerifying(true);

    try {
      const response = await api.post("/api/auth/verify-email", {
        token: verificationCode,
      });

      if (response.data.token) {
        await setAuth({
          user: response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
        });

        Alert.alert("Sukces!", "Email zweryfikowany! Witaj!", [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/dashboard"),
          },
        ]);
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      const errorMessage =
        error.response?.data?.message || "Nieprawidłowy kod weryfikacyjny";
      Alert.alert("Błąd weryfikacji", errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChange = (index: number, value: string) => {
    // Tylko cyfry
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Przesuń focus do następnego pola
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      await api.post("/api/auth/resend-verification", { email });
      Alert.alert("Sukces", "Nowy kod został wysłany na Twój email!");
    } catch (error: any) {
      console.error("Resend error:", error);

      if (error.response?.data?.error === "RATE_LIMIT") {
        Alert.alert("Zbyt wiele prób", error.response.data.message);
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Nie udało się wysłać kodu. Spróbuj ponownie.";
        Alert.alert("Błąd", errorMessage);
      }
    } finally {
      setIsResending(false);
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
              <MailIcon />
              <Text style={styles.title}>Wpisz kod weryfikacyjny</Text>
              <Text style={styles.subtitle}>
                Wysłaliśmy 6-cyfrowy kod na adres:
              </Text>
              <Text style={styles.email}>{email}</Text>
            </View>

            {/* Card z polami na kod */}
            <Card style={styles.formCard}>
              <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => {
                      inputRefs.current[index] = ref;
                    }}
                    style={styles.codeInput}
                    value={digit}
                    onChangeText={(value) => handleChange(index, value)}
                    onKeyPress={({ nativeEvent }) =>
                      handleKeyPress(index, nativeEvent.key)
                    }
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                    editable={!isVerifying}
                    autoFocus={index === 0}
                  />
                ))}
              </View>

              {isVerifying && (
                <Text style={styles.verifyingText}>Weryfikacja...</Text>
              )}

              <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                  💡 Możesz skopiować kod z emaila
                </Text>
              </View>

              {/* Przyciski */}
              <View style={styles.actions}>
                <Text style={styles.resendText}>Nie dostałeś kodu?</Text>
                <Button
                  title="Wyślij ponownie"
                  onPress={handleResend}
                  loading={isResending}
                  variant="outline"
                  size="small"
                  disabled={isVerifying}
                />
              </View>
            </Card>

            {/* Link powrotu */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Text style={styles.backText}>← Wróć do rejestracji</Text>
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
    fontSize: 24,
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
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginTop: spacing.xs,
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  codeInput: {
    flex: 1,
    height: 56,
    borderWidth: 2,
    borderColor: colors.border.medium,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
  },
  verifyingText: {
    textAlign: "center",
    color: colors.primary.blue,
    fontSize: 14,
    marginBottom: spacing.sm,
  },
  infoBox: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  infoText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: "center",
  },
  actions: {
    alignItems: "center",
    gap: spacing.sm,
  },
  resendText: {
    fontSize: 14,
    color: colors.text.secondary,
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
