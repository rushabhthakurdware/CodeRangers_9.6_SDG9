import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useChoiceNavigation } from "@/hooks/useChoiceNavigation";
import ChoiceButton from "@/components/common/ChoiceButton";
import { useTheme } from "@/hooks/useTheme";
import ThemeCycleButton from "@/components/theming/ThemeCycleButton";
import { useStylePalette } from "@/constants/StylePalette";
import { useServerConfig } from "@/context/ServerConfigContext";

const { width, height } = Dimensions.get("screen");
export default function ChoiceScreen() {
  const { navigateToRegister, navigateToLogin, navigateBack } =
    useChoiceNavigation();

  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme, colors } = useTheme();
  // 2. Pass the theme to the styles function
  const styles = useStylePalette();
  const cstyles = getStyles(effectiveTheme);

  const { showModal } = useServerConfig(); // 2. Get the showModal function from the context
  return (
    <View style={styles.container}>
      <ThemeCycleButton></ThemeCycleButton>
      <View style={styles.container2}>
        <Text style={styles.title}>Select an Option</Text>
        <ChoiceButton
          title="Create Account"
          onPress={navigateToRegister}
          color={colors.buttonCreateBg}
        />
        <ChoiceButton
          title="Login as User"
          onPress={() => navigateToLogin("citizen")}
          color={colors.buttonLoginBg}
        />

        <ChoiceButton title="Back" onPress={navigateBack} color="#6c757d" />

        <ChoiceButton
          title="Change Server IP"
          onPress={showModal}
          color="#6c757d"
        />
      </View>
    </View>
  );
}

export const getStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";

  const { colors } = useTheme();

  // 2. Return the complete, merged stylesheet using the colors object
  return StyleSheet.create({
    // --- Styles from Snippet 1 (Now Themed) ---
    settingItem: {
      backgroundColor: colors.proceedbuttoncolor,
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
    },
    settingText: {
      color: colors.cardTitle,
      fontSize: 16,
    },
  });
};
