# Matura Polski - Mobile App (React Native / Expo)

Aplikacja mobilna dla platformy edukacyjnej "Matura Polski" - przygoowania do matury z języka polskiego.

## 📋 Wymagania

- Node.js (wersja 18 lub nowsza)
- npm lub yarn
- Expo Go (aplikacja na telefon do testowania)
- Opcjonalnie: Android Studio lub Xcode dla emulatorów

## 🚀 Instalacja i uruchomienie

### 1. Instalacja zależności

```bash
cd mobile
npm install
```

### 2. Konfiguracja środowiska

Stwórz plik `.env` w głównym folderze `mobile/` (skopiuj z `.env` w projekcie):

```bash
# WAŻNE: Zmień localhost na swoje lokalne IP!
# Znajdź swoje IP komendą:
# Windows: ipconfig
# Mac/Linux: ifconfig

API_URL=http://192.168.1.100:4000  # ZMIEŃ NA SWOJE IP!

# Dla produkcji:
# API_URL=https://api.maturapolski.pl
```

**UWAGA:** Musisz zmienić `192.168.1.100` na swoje lokalne IP!

### 3. Zmiana IP w kodzie

Otwórz plik `src/services/api.ts` i zmień IP na swoje:

```typescript
const API_URL = __DEV__
  ? "http://192.168.1.100:4000" // ZMIEŃ NA SWOJE IP!
  : "https://api.maturapolski.pl";
```

### 4. Uruchomienie aplikacji

```bash
npm start
```

Lub specyficzne platformy:

```bash
# Android
npm run android

# iOS (tylko Mac)
npm run ios

# Web (development)
npm run web
```

### 5. Testowanie na telefonie

1. Zainstaluj aplikację **Expo Go** na swoim telefonie:

   - [Android - Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Upewnij się, że telefon i komputer są w tej samej sieci WiFi

3. Zeskanuj kod QR z terminala za pomocą Expo Go

## 📁 Struktura projektu

```
mobile/
├── app/                      # Expo Router - nawigacja
│   ├── _layout.tsx          # Layout główny
│   ├── index.tsx            # Ekran startowy (redirect)
│   ├── login.tsx            # Logowanie
│   ├── register.tsx         # Rejestracja
│   └── (tabs)/              # Nawigacja zakładkami
│       ├── _layout.tsx      # Layout zakładek
│       ├── dashboard.tsx    # Dashboard
│       ├── learn.tsx        # Nauka (placeholder)
│       ├── progress.tsx     # Postępy
│       └── profile.tsx      # Profil
├── src/
│   ├── components/          # Komponenty UI
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── Card.tsx
│   ├── constants/           # Stałe (kolory, theme)
│   │   └── theme.ts
│   ├── screens/             # Ekrany
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   └── DashboardScreen.tsx
│   ├── services/            # Serwisy API
│   │   └── api.ts
│   └── store/               # Zustand store
│       └── authStore.ts
├── assets/                  # Obrazy, ikony
├── .env                     # Zmienne środowiskowe
├── app.json                 # Konfiguracja Expo
├── package.json
└── tsconfig.json
```

## 🔑 Kluczowe pliki do modyfikacji

1. **`src/services/api.ts`** - Zmień IP na swoje lokalne
2. **`.env`** - Konfiguracja środowiska
3. **`src/store/authStore.ts`** - Zarządzanie stanem użytkownika
4. **`src/constants/theme.ts`** - Kolory i style

## 🎨 Design System

Aplikacja używa tego samego design system co web app:

- Kolory: Blue (#2563eb) → Purple (#9333ea) gradient
- Spacing: 4, 8, 16, 24, 32, 48px
- Border Radius: 8, 12, 16, 20px
- Typography: System fonts

## 📱 Nawigacja

Aplikacja używa **Expo Router** (file-based routing):

- `/login` - Ekran logowania
- `/register` - Ekran rejestracji
- `/(tabs)/dashboard` - Dashboard po zalogowaniu
- `/(tabs)/learn` - Nauka
- `/(tabs)/progress` - Postępy
- `/(tabs)/profile` - Profil

## 🔐 Autentykacja

- Tokeny przechowywane w **Expo SecureStore** (bezpieczne)
- Automatyczny refresh tokenów
- Interceptory axios dla każdego zapytania

## 🛠️ Rozwój aplikacji

### Dodawanie nowych ekranów

1. Stwórz komponent w `src/screens/NazwaScreen.tsx`
2. Dodaj route w odpowiednim folderze `app/`
3. Export z nowego pliku route

Przykład:

```typescript
// app/nowa-strona.tsx
export { default } from "../src/screens/NowaStrona";
```

### Dodawanie nowych komponentów UI

Stwórz w `src/components/ui/` i używaj theme z `constants/theme.ts`

### API Calls

Używaj `api` z `src/services/api.ts`:

```typescript
import { api } from "../services/api";

const response = await api.get("/api/endpoint");
```

## 📦 Build Production

### Android

```bash
# Development build
eas build --profile development --platform android

# Production build
eas build --profile production --platform android
```

### iOS

```bash
# Development build
eas build --profile development --platform ios

# Production build
eas build --profile production --platform ios
```

## 🐛 Troubleshooting

### Nie działa połączenie z API

1. Sprawdź czy backend działa (`http://localhost:4000/health`)
2. Sprawdź IP w `src/services/api.ts` i `.env`
3. Upewnij się, że telefon i komputer są w tej samej sieci WiFi
4. Spróbuj wyłączyć firewall na komputerze

### Błędy z Expo Go

1. Upewnij się, że masz najnowszą wersję Expo Go
2. Wyczyść cache: `npx expo start -c`
3. Usuń folder `node_modules` i zainstaluj ponownie

### Problemy z zależnościami

```bash
# Usuń i zainstaluj ponownie
rm -rf node_modules package-lock.json
npm install
```

## 📚 Dokumentacja

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/docs/getting-started)
- [React Query](https://tanstack.com/query/latest)

## 🚀 Następne kroki

1. **Dodaj ikony**: Zamień emoji na prawdziwe ikony z `@expo/vector-icons`
2. **Implementuj sesje nauki**: Dodaj pełną funkcjonalność ekranu `learn`
3. **Implementuj ćwiczenia**: Połącz z endpointem `/api/exercises`
4. **Dodaj notyfikacje**: Expo Notifications dla przypomnień
5. **Offline mode**: React Query persistence
6. **Dark mode**: Dodaj wsparcie dla ciemnego motywu
7. **Animacje**: Użyj Reanimated dla płynnych animacji
8. **Testy**: Dodaj unit testy i E2E testy

## 📄 Licencja

Copyright © 2025 Matura Polski. Wszystkie prawa zastrzeżone.

## 👥 Wsparcie

Pytania lub problemy? Skontaktuj się z zespołem deweloperskim.
