// src/store/authStore.ts
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  emailVerified?: boolean;
  picture?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  setUser: (user: User) => void;
  setTokens: (tokens: { token: string; refreshToken: string }) => void;
  setAuth: (data: {
    user: User;
    token: string;
    refreshToken: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

// ✅ Custom storage dla React Native z SecureStore
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await SecureStore.getItemAsync(name);
      return value;
    } catch (error) {
      console.error("SecureStore getItem error:", error);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch (error) {
      console.error("SecureStore setItem error:", error);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch (error) {
      console.error("SecureStore removeItem error:", error);
    }
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,

      setUser: (user) => {
        console.log("Setting user:", user);
        set({ user, isAuthenticated: true });
      },

      setTokens: (tokens) => {
        console.log("Setting tokens");
        set({
          token: tokens.token,
          refreshToken: tokens.refreshToken,
          isAuthenticated: true,
        });
      },

      // ✅ Async metoda - ustaw wszystko na raz
      setAuth: async (data) => {
        console.log("Setting complete auth data:", data.user.email);
        set({
          user: data.user,
          token: data.token,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
        });
      },

      // ✅ Async logout
      logout: async () => {
        console.log("Logging out...");
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
        });
        await SecureStore.deleteItemAsync("auth-storage");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        console.log("Rehydrated auth state:", state?.user?.email || "no user");
      },
    }
  )
);
