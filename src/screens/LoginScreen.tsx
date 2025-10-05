// src/screens/LoginScreen.tsx
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
import { useAuthStore } from "../store/authStore";

// Ikony (możesz użyć react-native-vector-icons lub @expo/vector-icons)
// Dla przykładu używam prostych emoji
const MailIcon = () => <Text style={styles.icon}>✉️</Text>;
const LockIcon = () => <Text style={styles.icon}>🔒</Text>;
const EyeIcon = () => <Text style={styles.icon}>👁️</Text>;
const EyeOffIcon = () => <Text style={styles.icon}>🙈</Text>;

const loginSchema = z.object({
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(1, "Hasło jest wymagane"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await api.post("/api/auth/login", data);

      if (response.data.user && response.data.token) {
        await setAuth({
          user: response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken || "",
        });

        // Przekieruj na dashboard
        router.replace("/(tabs)/dashboard");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Błąd logowania. Sprawdź email i hasło.";
      Alert.alert("Błąd logowania", errorMessage);
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
              <Text style={styles.subtitle}>Zaloguj się do swojego konta</Text>
            </View>

            {/* Formularz */}
            <Card style={styles.formCard}>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Email"
                    placeholder="jan.kowalski@example.com"
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

              <TouchableOpacity
                onPress={() => router.push("/forgot-password")}
                style={styles.forgotPassword}
              >
                <Text style={styles.forgotPasswordText}>
                  Zapomniałeś hasła?
                </Text>
              </TouchableOpacity>

              <Button
                title="Zaloguj się"
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
                title="Zaloguj przez Google"
                onPress={() => Alert.alert("Google Login", "Coming soon!")}
                variant="outline"
                fullWidth
              />
            </Card>

            {/* Link do rejestracji */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Nie masz konta? </Text>
              <TouchableOpacity onPress={() => router.push("/register")}>
                <Text style={styles.footerLink}>Zarejestruj się</Text>
              </TouchableOpacity>
            </View>
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
    padding: spacing.lg,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: spacing.md,
  },
  forgotPasswordText: {
    color: colors.primary.blue,
    fontSize: 14,
    fontWeight: "500",
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
});
