import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
// ✅ Make sure to import from your StyleSheet-based context hook
import { useTheme } from "@/context/ThemeContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Palette } from "@/constants/Palette";

// Define the type for valid icon names
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

// Define the cycle order and corresponding icons
const themeCycle = ["system", "light", "dark"] as const;
const themeIcons: Record<(typeof themeCycle)[number], IconName> = {
  system: "theme-light-dark",
  light: "white-balance-sunny",
  dark: "moon-waning-crescent",
};

type ThemeCycleButtonProps = {
  style?: ViewStyle;
  size?: number;
  color?: string;
};

export default function ThemeCycleButton({
  style,
  size = 24,
  color = "#007BFF",
}: ThemeCycleButtonProps) {
  // ✅ Get the user's selected option and the setter function
  const { themeOption, setThemeOption } = useTheme();

  const handlePress = () => {
    const currentIndex = themeCycle.indexOf(themeOption);
    // Cycle to the next theme in the array
    const nextIndex = (currentIndex + 1) % themeCycle.length;
    setThemeOption(themeCycle[nextIndex]);
  };

  // ✅ Get the correct icon name for the current theme option
  const iconName = themeIcons[themeOption];

  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme } = useTheme();
  // 2. Pass the theme to the styles function
  const styles = getStyles(effectiveTheme);
  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.6 : 1.0 },
        style,
      ]}
      hitSlop={10} // Makes the button easier to tap
    >
      <MaterialCommunityIcons name={iconName} size={size} color={color} />
    </Pressable>
  );
}
export const getStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";
  const insets = useSafeAreaInsets();

  const { colors } = useTheme();
  /*
  const colors = {
    themeButton: isDark
      ? Palette.darkthemebuttoncolor
      : Palette.lighttheembuttoncolor,
    themeBorder: isDark
      ? Palette.darkthemebuttonborder
      : Palette.lighttheembuttonborder,
  };*/
  return StyleSheet.create({
    button: {
      backgroundColor: colors.themeButton,
      position: "absolute",
      right: 0,
      top: insets.top,
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      zIndex: 10,
      padding: 8,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      borderTopColor: colors.themeBorder,
      borderBottomColor: colors.themeBorder,
      borderLeftColor: colors.themeBorder,
      borderWidth: 1,
    },
  });
};
/*
const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});*/
