import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ThemeSetting from "@/components/settings/ThemeSetting";
import LogoutButton from "@/components/settings/LogoutButton";
import DeleteAccountButton from "@/components/settings/DeleteAccount";
import ThemeCycleButton from "@/components/theming/ThemeCycleButton";
import { useTheme } from "@/hooks/useTheme";
import { useStylePalette } from "@/constants/StylePalette";
import { SafeAreaView } from "react-native-safe-area-context";
import LanguagePicker from "@/components/settings/LanguageSetting";
import { useServerConfig } from "@/context/ServerConfigContext";
import ServerConfigSetting from "@/components/settings/ChangeServerIp";

export default function SettingsScreen() {
  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme, colors } = useTheme();
  // 2. Pass the theme to the styles function
  const cstyles = getStyles(effectiveTheme);
  const styles = useStylePalette();

  const { showModal } = useServerConfig(); // 2. Get the showModal function from the context

  return (
    <View style={[styles.tabcontainer, { flex: 1 }]}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ThemeCycleButton style={{ opacity: 0 }}></ThemeCycleButton>
        <Text style={styles.title}>Settings</Text>

        <ThemeSetting />
        <LanguagePicker />
        <ServerConfigSetting />
        <LogoutButton />
        <DeleteAccountButton />
      </SafeAreaView>
    </View>
  );
}

export const getStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";

  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.tabBackground,
    },
    header: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
    },
  });
};
