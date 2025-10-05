// app/index.tsx
import { router } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../src/store/authStore";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/(tabs)/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [isAuthenticated, isLoading]);

  return null;
}
