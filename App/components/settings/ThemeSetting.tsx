import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import SettingItem from "@/components/common/SettingItem";
import { Picker } from "@react-native-picker/picker";
import { useStylePalette } from "@/constants/StylePalette";

export default function ThemeSetting() {
  // ✅ Get the user's preference ('system', 'light', or 'dark') and the setter
  const { themeOption, setThemeOption } = useTheme();

  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme, colors } = useTheme();
  // 2. Pass the theme to the styles function
  const cstyles = getStyles(effectiveTheme);
  const styles = useStylePalette();
  return (
    <SettingItem label="Theme">
      <View style={cstyles.pickerContainer}>
        <Picker
          selectedValue={themeOption}
          onValueChange={(itemValue) => setThemeOption(itemValue)}
          style={cstyles.picker}
          dropdownIconColor="#007BFF"
          mode="dropdown"
          itemStyle={{ color: colors.text }}
        >
          <Picker.Item label="Automatic" value="system" />
          <Picker.Item label="Light" value="light" />
          <Picker.Item label="Dark" value="dark" />
        </Picker>
      </View>
    </SettingItem>
  );
}

export const getStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";

  const { colors } = useTheme();
  return StyleSheet.create({
    pickerContainer: {
      height: 50,
      width: 150,
      justifyContent: "center",
    },
    picker: {
      width: "100%",
      color: colors.text,
    },
  });
};
