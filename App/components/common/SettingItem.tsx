import { useStylePalette } from "@/constants/StylePalette";
import { useTheme } from "@/hooks/useTheme";
import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type SettingItemProps = {
  label: string;
  children: ReactNode;
  onPress?: () => void;
};

export default function SettingItem({
  label,
  children,
  onPress,
}: SettingItemProps) {
  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme, colors } = useTheme();
  // 2. Pass the theme to the styles function
  const cstyles = getStyles(effectiveTheme);
  const styles = useStylePalette();
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <View style={cstyles.container}>
        <Text style={cstyles.label}>{label}</Text>
        <View>{children}</View>
      </View>
    </TouchableOpacity>
  );
}

export const getStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";

  const { colors } = useTheme();
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      padding: 10,
      margin: 3,
      backgroundColor: colors.background,
      borderRadius: 10,
    },
    label: {
      fontSize: 16,
      color: colors.text,
    },
  });
};
