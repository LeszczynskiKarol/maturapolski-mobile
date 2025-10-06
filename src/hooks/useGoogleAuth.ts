// src/hooks/useGoogleAuth.ts
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { api } from "../services/api";
import { useAuthStore } from "../store/authStore";
import { router } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID =
  "527331942673-g9cn1o1sj09e3qbd4flo0ugfgn60dgm2.apps.googleusercontent.com";
const GOOGLE_IOS_CLIENT_ID = GOOGLE_WEB_CLIENT_ID; // Użyj tego samego na razie
const GOOGLE_ANDROID_CLIENT_ID = GOOGLE_WEB_CLIENT_ID; // Użyj tego samego na razie

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  });

  useEffect(() => {
    console.log("==== GOOGLE RESPONSE ====");
    console.log("Response type:", response?.type);

    if (!response) {
      return;
    }

    // ✅ Type guard - sprawdź typ przed dostępem do params
    if (response.type === "success") {
      console.log("✅ Google auth SUCCESS");
      console.log("Response params:", response.params);

      const { id_token } = response.params;
      console.log("🔐 ID Token received, length:", id_token?.length);

      if (id_token) {
        handleGoogleLogin(id_token);
      } else {
        console.error("❌ No ID token in response");
        Alert.alert("Błąd", "Brak ID token w odpowiedzi Google");
      }
    } else if (response.type === "error") {
      console.error("❌ Google auth ERROR:", response.error);
      Alert.alert(
        "Błąd",
        `Logowanie nie powiodło się: ${
          response.error?.message || "Unknown error"
        }`
      );
    } else if (response.type === "cancel") {
      console.log("⚠️ User cancelled Google sign-in");
    } else {
      console.log("⚠️ Response type:", response.type);
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    setIsLoading(true);

    try {
      console.log("==== GOOGLE LOGIN START ====");
      console.log("🔐 ID Token length:", idToken.length);
      console.log("📡 API URL:", "https://api.maturapolski.pl/api/auth/google");
      console.log("📤 Sending request...");

      const result = await api.post("/api/auth/google", {
        credential: idToken,
      });

      console.log("✅ SUCCESS! Response:", result.status);
      console.log("✅ User:", result.data.user.email);

      if (result.data.user && result.data.token) {
        await setAuth({
          user: result.data.user,
          token: result.data.token,
          refreshToken: result.data.refreshToken || "",
        });

        Alert.alert("Sukces!", "Zalogowano przez Google!", [
          {
            text: "OK",
            onPress: () => {
              if (result.data.user.role === "ADMIN") {
                router.replace("/admin");
              } else {
                router.replace("/(tabs)/dashboard");
              }
            },
          },
        ]);
      }
    } catch (error: any) {
      console.log("==== GOOGLE LOGIN ERROR ====");
      console.error("❌ Error type:", error.constructor.name);
      console.error("❌ Error message:", error.message);
      console.error("❌ Status:", error.response?.status);
      console.error(
        "❌ Response data:",
        JSON.stringify(error.response?.data, null, 2)
      );

      const errorMessage =
        error.response?.data?.message ||
        "Logowanie przez Google nie powiodło się";

      Alert.alert(
        "Błąd logowania",
        `${errorMessage}\n\nStatus: ${error.response?.status || "unknown"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = () => {
    console.log("🔵 Starting Google Sign-In...");
    console.log("🔵 Request object:", request ? "EXISTS" : "NULL");

    if (request) {
      console.log("🔵 Calling promptAsync()...");
      promptAsync()
        .then(() => console.log("✅ promptAsync completed"))
        .catch((err) => console.error("❌ promptAsync error:", err));
    } else {
      console.error("❌ Request is null - Google not ready");
      Alert.alert("Błąd", "Google Sign-In nie jest gotowy");
    }
  };

  return {
    signInWithGoogle,
    isLoading,
    isReady: !!request,
  };
};
