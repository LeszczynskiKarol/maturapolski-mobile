// app/(tabs)/profile.tsx
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../src/components/ui/Button";
import { Card } from "../../src/components/ui/Card";
import { colors, spacing } from "../../src/constants/theme";
import { useAuthStore } from "../../src/store/authStore";

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert("Wylogowanie", "Czy na pewno chcesz się wylogować?", [
      {
        text: "Anuluj",
        style: "cancel",
      },
      {
        text: "Wyloguj",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil</Text>
      </View>

      {/* Avatar i dane użytkownika */}
      <Card padding="large" style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {user?.picture ? (
              <Text style={styles.avatarEmoji}>👤</Text>
            ) : (
              <Text style={styles.avatarEmoji}>👤</Text>
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user?.username || "User"}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {user?.role === "ADMIN" ? "Admin" : "Student"}
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Menu opcji */}
      <Text style={styles.sectionTitle}>Ustawienia</Text>

      <Card padding="none" style={styles.menuCard}>
        <MenuItem
          icon="⚙️"
          title="Ustawienia konta"
          onPress={() => Alert.alert("Info", "W budowie")}
        />
        <MenuDivider />
        <MenuItem
          icon="🔔"
          title="Powiadomienia"
          onPress={() => Alert.alert("Info", "W budowie")}
        />
        <MenuDivider />
        <MenuItem
          icon="🎨"
          title="Wygląd"
          onPress={() => Alert.alert("Info", "W budowie")}
        />
      </Card>

      <Text style={styles.sectionTitle}>Pomoc i wsparcie</Text>

      <Card padding="none" style={styles.menuCard}>
        <MenuItem
          icon="❓"
          title="FAQ"
          onPress={() => Alert.alert("Info", "W budowie")}
        />
        <MenuDivider />
        <MenuItem
          icon="📧"
          title="Kontakt"
          onPress={() => Alert.alert("Info", "W budowie")}
        />
        <MenuDivider />
        <MenuItem
          icon="📄"
          title="Regulamin"
          onPress={() => Alert.alert("Info", "W budowie")}
        />
        <MenuDivider />
        <MenuItem
          icon="🔒"
          title="Polityka prywatności"
          onPress={() => Alert.alert("Info", "W budowie")}
        />
      </Card>

      <Text style={styles.sectionTitle}>O aplikacji</Text>

      <Card padding="large" style={styles.aboutCard}>
        <Text style={styles.aboutTitle}>Matura Polski</Text>
        <Text style={styles.aboutVersion}>Wersja 1.0.0</Text>
        <Text style={styles.aboutText}>
          Inteligentna platforma do nauki języka polskiego
        </Text>
      </Card>

      {/* Przycisk wylogowania */}
      <Button
        title="Wyloguj się"
        onPress={handleLogout}
        variant="outline"
        fullWidth
        style={styles.logoutButton}
      />
    </ScrollView>
  );
}

const MenuItem = ({
  icon,
  title,
  onPress,
}: {
  icon: string;
  title: string;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={styles.menuItem}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.menuItemLeft}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <Text style={styles.menuTitle}>{title}</Text>
    </View>
    <Text style={styles.menuArrow}>›</Text>
  </TouchableOpacity>
);

const MenuDivider = () => <View style={styles.menuDivider} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
  },
  userCard: {
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary.blue + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEmoji: {
    fontSize: 40,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  roleBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.primary.blue + "20",
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary.blue,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  menuCard: {
    marginBottom: spacing.md,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  menuIcon: {
    fontSize: 20,
  },
  menuTitle: {
    fontSize: 16,
    color: colors.text.primary,
  },
  menuArrow: {
    fontSize: 24,
    color: colors.text.tertiary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginHorizontal: spacing.md,
  },
  aboutCard: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  aboutVersion: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  aboutText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
  },
  logoutButton: {
    marginTop: spacing.md,
  },
});
