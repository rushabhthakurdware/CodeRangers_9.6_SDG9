import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useTheme } from "@/context/ThemeContext";
import { useStylePalette } from "@/constants/StylePalette";
import { useTranslations } from "@/context/LanguageContext";
import LanguagePicker from "../settings/LanguageSetting";
const { width, height } = Dimensions.get("screen");
export default function WelcomeContent() {
  const router = useRouter();

  // This hook still returns the correct 'strings' object
  const { strings } = useTranslations();
  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme, colors } = useTheme();
  // 2. Pass the theme to the styles function
  const cstyles = getStyles(effectiveTheme);
  const styles = useStylePalette();
  return (
    <View style={cstyles.contentContainer}>
      {/*<LinearGradient
        // ✅ The gradient now goes from transparent to the theme's background color
        colors={["transparent", colors.welcomeGradientEnd]}
        // The gradient starts at the top (0) and ends at the 10% mark (0.1)
        locations={[0, 0.1]}
        style={cstyles.gradient}
      />*/}

      <Text></Text>
      <Text style={styles.subtitle2}></Text>
      <Text
        style={[
          styles.title,
          {
            backgroundColor: "#00ff1557",
            borderRadius: 10,
            padding: 10,
            fontSize: 24,
          },
        ]}
      >
        {strings.welcomeScreen.title}
      </Text>
      <Text style={styles.subtitle2}></Text>
      <Text style={[styles.subtitle1, { textAlign: "center", width: "90%" }]}>
        {strings.welcomeScreen.subtitle1}
      </Text>
      <Text style={[styles.subtitle1, { marginBottom: 0 }]}>
        {strings.welcomeScreen.subtitle2}
      </Text>

      <Text style={{ fontSize: 30, color: colors.subtitle }}>{"\u2193"}</Text>
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => router.push("/choice")}
      >
        <Text style={styles.buttonText}>
          {strings.welcomeScreen.getStartedButton}
        </Text>
      </TouchableOpacity>

      <Text></Text>
      <LanguagePicker />
      <Text></Text>
      <TouchableOpacity
        style={cstyles.learnMoreButton}
        onPress={() => router.push("/choice")}
      >
        <Text style={[styles.buttonText]}>
          {strings.welcomeScreen.learnMoreButton}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export const getStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";
  /*
  // Define colors for each theme/*
  const colors = {
    title: isDark ? "#FFFFFF" : "#333333",
    subtitle: isDark ? "#A0A0A0" : "#666666",
    buttonBg: isDark ? "#3B82F6" : "#007BFF",
    buttonText: "#FFFFFF",
  };*/

  const { colors } = useTheme();
  return StyleSheet.create({
    contentContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingTop: 0,
      height: height * 0.6,
      zIndex: 4,
      alignItems: "center",
    },
    gradient: {
      ...StyleSheet.absoluteFillObject,
      width: width,
      bottom: 0,
      left: 0,
      right: 0,
      padding: 0,
    },
    getStartedButton: {
      backgroundColor: colors.buttonLoginBg,
      paddingVertical: 15,
      paddingHorizontal: 60,
      borderRadius: 30,
      alignItems: "center",
    },
    learnMoreButton: {
      backgroundColor: colors.buttonCreateBg,
      paddingVertical: 10,
      paddingHorizontal: 40,
      borderRadius: 30,
      marginTop: 10,
      alignItems: "center",
    },
  });
};
