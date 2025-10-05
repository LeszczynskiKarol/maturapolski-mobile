// src/services/api.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";

// Zmień na swoje lokalne IP dla development
// lub na domenę produkcyjną
const API_URL = "https://api.maturapolski.pl";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Mobile nie używa cookies
});

// Request interceptor - dodaje token do każdego zapytania
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - obsługa błędów i refresh tokenu
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jeśli 401 i nie próbowaliśmy jeszcze refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (!refreshToken) {
          // Brak refresh tokenu - wyloguj
          await SecureStore.deleteItemAsync("authToken");
          await SecureStore.deleteItemAsync("refreshToken");
          return Promise.reject(error);
        }

        // Spróbuj odświeżyć token
        const { data } = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        });

        // Zapisz nowy token
        await SecureStore.setItemAsync("authToken", data.token);

        // Powtórz oryginalne zapytanie z nowym tokenem
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh nie udał się - wyloguj
        await SecureStore.deleteItemAsync("authToken");
        await SecureStore.deleteItemAsync("refreshToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { api, API_URL };
