import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useUserData } from "@/hooks/useUserData";
import ThemeCycleButton from "@/components/theming/ThemeCycleButton";
import { useTheme } from "@/hooks/useTheme";
import { useStylePalette } from "@/constants/StylePalette";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedScreen() {
  const user = useUserData();

  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme, colors } = useTheme();
  // 2. Pass the theme to the styles function
  const cstyles = getStyles(effectiveTheme);
  const styles = useStylePalette();

  return (
    <View style={styles.tabcontainer}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ThemeCycleButton style={{ opacity: 0 }}></ThemeCycleButton>
        <Text style={[styles.title, { marginBottom: 10 }]}>
          Welcome Back, {user?.name}
        </Text>

        <View
          style={[styles.separator, { marginVertical: 0, marginBottom: 10 }]}
        />
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
    },
    text: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      padding: 16,
    },
    loadingText: {
      flex: 1,
      textAlign: "center",
      textAlignVertical: "center",
    },
  });
};
