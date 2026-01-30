import React from "react";
import { Picker } from "@react-native-picker/picker";
import { useTranslations } from "@/context/LanguageContext"; // Corrected path
import { languages, LanguageCode } from "@/constants/Strings"; // Corrected path and added LanguageCode
import { useTheme } from "@/context/ThemeContext"; // Assuming you have a ThemeContext for colors
import { useStylePalette } from "@/constants/StylePalette";
import { StyleSheet, View } from "react-native";
import SettingItem from "../common/SettingItem";

const LanguagePicker = () => {
  // 1. Get contexts
  const { locale, setLocale } = useTranslations();

  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme, colors } = useTheme();
  // 2. Pass the theme to the styles function
  const cstyles = getStyles(effectiveTheme);
  const styles = useStylePalette();

  return (
    <SettingItem label="Choose Your Language">
      <View style={cstyles.pickerContainer}>
        <Picker
          selectedValue={locale}
          // 3. Added type assertion for better type safety
          onValueChange={(itemValue) => setLocale(itemValue as LanguageCode)}
          // --- Your existing styles ---
          style={cstyles.picker}
          dropdownIconColor="#007BFF"
          mode="dropdown"
          itemStyle={{ color: colors.text }} // 'colors' is now defined
        >
          {/* 4. Dynamically create the Picker.Item list */}
          {languages.map((lang) => (
            <Picker.Item key={lang.code} label={lang.name} value={lang.code} />
          ))}
        </Picker>
      </View>
    </SettingItem>
  );
};

export default LanguagePicker;

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
