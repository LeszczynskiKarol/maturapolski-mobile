// src/screens/RegisterScreen.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { colors, spacing } from "../constants/theme";
import { api } from "../services/api";

// Ikony
const MailIcon = () => <Text style={styles.icon}>✉️</Text>;
const UserIcon = () => <Text style={styles.icon}>👤</Text>;
const LockIcon = () => <Text style={styles.icon}>🔒</Text>;
const EyeIcon = () => <Text style={styles.icon}>👁️</Text>;
const EyeOffIcon = () => <Text style={styles.icon}>🙈</Text>;
const CheckIcon = () => <Text style={styles.checkIcon}>✓</Text>;

const registerSchema = z
  .object({
    email: z.string().email("Nieprawidłowy adres email"),
    username: z
      .string()
      .min(3, "Minimum 3 znaki")
      .max(20, "Maksimum 20 znaków")
      .regex(/^[a-zA-Z0-9_-]+$/, "Tylko litery, cyfry, _ i -"),
    password: z.string().min(8, "Hasło musi mieć minimum 8 znaków"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password");

  // Password strength indicator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, text: "", color: "" };

    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score++;

    if (score <= 2) return { score, text: "Słabe", color: colors.error };
    if (score <= 3) return { score, text: "Średnie", color: colors.warning };
    if (score <= 4) return { score, text: "Dobre", color: colors.primary.blue };
    return { score, text: "Bardzo dobre", color: colors.success };
  };

  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterFormData) => {
    if (passwordStrength.score < 3) {
      Alert.alert("Błąd", "Hasło jest zbyt słabe. Użyj mocniejszego hasła.");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/api/auth/register", {
        email: data.email,
        username: data.username,
        password: data.password,
      });

      Alert.alert("Sukces!", "Konto utworzone! Sprawdź swoją skrzynkę email.", [
        {
          text: "OK",
          onPress: () => router.replace("/login"),
        },
      ]);
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage =
        error.response?.data?.message || "Błąd rejestracji. Spróbuj ponownie.";
      Alert.alert("Błąd rejestracji", errorMessage);
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
            {/* Logo i nagłówek */}
            <View style={styles.header}>
              <Text style={styles.logo}>📚</Text>
              <Text style={styles.title}>Matura Polski</Text>
              <Text style={styles.subtitle}>Załóż konto i zacznij naukę</Text>
            </View>

            {/* Formularz */}
            <Card style={styles.formCard}>
              <Controller
                control={control}
                name="username"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Twoje imię"
                    placeholder="Jan"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    icon={<UserIcon />}
                    error={errors.username?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Email"
                    placeholder="jan@example.com"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    icon={<MailIcon />}
                    error={errors.email?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Hasło"
                    placeholder="••••••••"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                    icon={<LockIcon />}
                    rightIcon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    onRightIconPress={() => setShowPassword(!showPassword)}
                    error={errors.password?.message}
                  />
                )}
              />

              {/* Password strength indicator */}
              {password && password.length > 0 && (
                <View style={styles.passwordStrength}>
                  <View style={styles.strengthBar}>
                    <View
                      style={[
                        styles.strengthBarFill,
                        {
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: passwordStrength.color,
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.strengthText,
                      { color: passwordStrength.color },
                    ]}
                  >
                    {passwordStrength.text}
                  </Text>

                  <View style={styles.requirements}>
                    <RequirementItem
                      met={/[a-z]/.test(password) && /[A-Z]/.test(password)}
                      text="Duże i małe litery"
                    />
                    <RequirementItem
                      met={/\d/.test(password)}
                      text="Przynajmniej jedna cyfra"
                    />
                    <RequirementItem
                      met={password.length >= 8}
                      text="Minimum 8 znaków"
                    />
                  </View>
                </View>
              )}

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Potwierdź hasło"
                    placeholder="••••••••"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showConfirmPassword}
                    icon={<LockIcon />}
                    rightIcon={
                      showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />
                    }
                    onRightIconPress={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    error={errors.confirmPassword?.message}
                  />
                )}
              />

              <Text style={styles.termsText}>
                Rejestrując się, akceptujesz{" "}
                <Text style={styles.termsLink}>Regulamin</Text> i{" "}
                <Text style={styles.termsLink}>Politykę prywatności</Text>
              </Text>

              <Button
                title="Zarejestruj się"
                onPress={handleSubmit(onSubmit)}
                loading={isLoading}
                fullWidth
                size="large"
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>lub</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title="Zarejestruj przez Google"
                onPress={() => Alert.alert("Google Sign Up", "Coming soon!")}
                variant="outline"
                fullWidth
              />
            </Card>

            {/* Link do logowania */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Masz już konto? </Text>
              <TouchableOpacity onPress={() => router.push("/login")}>
                <Text style={styles.footerLink}>Zaloguj się</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

// Helper component for password requirements
const RequirementItem: React.FC<{ met: boolean; text: string }> = ({
  met,
  text,
}) => (
  <View style={styles.requirement}>
    <View style={[styles.requirementIcon, met && styles.requirementIconMet]}>
      {met && <CheckIcon />}
    </View>
    <Text style={styles.requirementText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
  logo: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    textAlign: "center",
  },
  formCard: {
    marginBottom: spacing.lg,
  },
  passwordStrength: {
    marginBottom: spacing.md,
  },
  strengthBar: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: spacing.xs,
  },
  strengthBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  requirements: {
    gap: spacing.xs,
  },
  requirement: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  requirementIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  requirementIconMet: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  requirementText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  termsText: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  termsLink: {
    color: colors.primary.blue,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    color: colors.text.secondary,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  footerLink: {
    color: colors.primary.blue,
    fontSize: 14,
    fontWeight: "600",
  },
  icon: {
    fontSize: 20,
  },
  checkIcon: {
    fontSize: 12,
    color: colors.text.white,
    fontWeight: "700",
  },
});
