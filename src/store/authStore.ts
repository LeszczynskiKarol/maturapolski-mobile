// src/store/authStore.ts
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface User {
  id: string;
  email: string;
  username: string;
  role: "STUDENT" | "ADMIN";
  picture?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (data: {
    user: User;
    token: string;
    refreshToken?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: async ({ user, token, refreshToken }) => {
    // Zapisz tokeny w SecureStore
    await SecureStore.setItemAsync("authToken", token);
    if (refreshToken) {
      await SecureStore.setItemAsync("refreshToken", refreshToken);
    }
    await SecureStore.setItemAsync("user", JSON.stringify(user));

    set({
      user,
      token,
      refreshToken: refreshToken || null,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  logout: async () => {
    // Usuń wszystkie dane z SecureStore
    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("user");

    set({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  updateUser: (userData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },

  // Inicjalizacja - sprawdź czy użytkownik jest zalogowany
  initAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync("authToken");
      const refreshToken = await SecureStore.getItemAsync("refreshToken");
      const userJson = await SecureStore.getItemAsync("user");

      if (token && userJson) {
        const user = JSON.parse(userJson);
        set({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ isLoading: false });
    }
  },
}));
