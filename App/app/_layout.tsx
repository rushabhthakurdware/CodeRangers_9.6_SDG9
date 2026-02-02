import { AuthProvider } from "@/hooks/useAuth";
import { Stack } from "expo-router";
import { useAuth } from "@/hooks/useAuth"; // We need this for the initial check
import {
  ActivityIndicator,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { ThemeProvider } from "@/context/ThemeContext";
import { useNavigationBar } from "@/hooks/usenavigationBar";
import { SystemBars } from "react-native-edge-to-edge";
import { SafeAreaView } from "react-native-safe-area-context";
import { LanguageProvider } from "@/context/LanguageContext";
import ServerConfigModal from "@/components/debug/ServerConfigModal";
import { setApiBaseUrl } from "@/lib/api/apiClient";
import { useEffect, useState } from "react";
// import { loadServerIp, saveServerIp } from "@/lib/storage/serverStorage";

// Force correct URL on startup
const SERVER_URL = "https://unreverent-jonelle-unvehemently.ngrok-free.dev";
setApiBaseUrl(SERVER_URL);
import AppInitializer from "@/components/debug/DebugIpInit";
import { useStylePalette } from "@/constants/StylePalette";
import { useTheme } from "@/hooks/useTheme";
import {
  ServerConfigProvider,
  useServerConfig,
} from "@/context/ServerConfigContext";

// A component to handle the initial loading and routing logic
function Root() {
  const { loading } = useAuth();
  // useNavigationBar();

  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme, colors } = useTheme();
  // 2. Pass the theme to the styles function
  const styles = getStyles(effectiveTheme);
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // The Slot will automatically render the correct group (public, auth, or tabs)
  // This is no longer needed here as the group layouts handle redirection.
  // We use Stack.Screen to define the available routes.

  // Direct access to tabs, bypassing auth
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)">
      <Stack.Screen name="(tabs)" />
      {/* Kept specifically if needed, but main flow is tabs */}
      <Stack.Screen name="(public)" />
      <Stack.Screen name="(auth)" />
    </Stack>
  );
}

function AppContent() {
  const { isModalVisible, hideModal, saveIpAddress, currentIp } =
    useServerConfig();

  const handleSkip = () => {
    console.log("Modal closed without changes.");
    hideModal();
  };

  return (
    <>
      <AuthProvider>
        {/* Your Root component from before, containing the Stack navigator */}
        <Root />
      </AuthProvider>

      {/* The modal is rendered here, but controlled by the context */}
      <ServerConfigModal
        visible={isModalVisible}
        onSave={saveIpAddress}
        onSkip={handleSkip} // onSkip can now just mean "close"
        currentIp={currentIp}
      />
    </>
  );
}
// This is now the main component that controls the entire app startup flow
export default function RootLayout() {
  return (
    <ServerConfigProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </ThemeProvider>
    </ServerConfigProvider>
  );
}

export const getStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";

  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background, // A neutral background
    },
  });
};
