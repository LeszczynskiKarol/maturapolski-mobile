// src/constants/theme.ts

export const colors = {
  // Primary - gradient blue to purple jak w web app
  primary: {
    blue: "#2563eb", // blue-600
    purple: "#9333ea", // purple-600
    light: "#3b82f6", // blue-500
    dark: "#1e40af", // blue-700
  },

  // Background
  background: {
    primary: "#ffffff",
    secondary: "#f9fafb", // gray-50
    tertiary: "#f3f4f6", // gray-100
  },

  // Text
  text: {
    primary: "#111827", // gray-900
    secondary: "#6b7280", // gray-500
    tertiary: "#9ca3af", // gray-400
    white: "#ffffff",
  },

  // Status
  success: "#10b981", // green-500
  error: "#ef4444", // red-500
  warning: "#f59e0b", // amber-500
  info: "#3b82f6", // blue-500

  // Border
  border: {
    light: "#e5e7eb", // gray-200
    medium: "#d1d5db", // gray-300
    dark: "#9ca3af", // gray-400
  },

  // Special
  orange: "#f97316", // orange-500 dla streak
  yellow: "#eab308", // yellow-500
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: "700" as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
};
