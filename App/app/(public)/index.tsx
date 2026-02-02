import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import ImageCarousel from "@/components/welcome/ImageCarousel";
import { useTheme } from "@/context/ThemeContext";
import WelcomeContent from "@/components/welcome/WelcomeContent";
import ThemeCycleButton from "@/components/theming/ThemeCycleButton";
import { SystemBars } from "react-native-edge-to-edge";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Palette } from "@/constants/Palette";

const imageData = [
  "https://free-images.com/or/eddb/community_old_man_amateur.jpg",
  "https://free-images.com/or/6d5f/meddac_2015_breast_cancer_72.jpg",
  "https://free-images.com/or/c21e/shanghai_community_life_football.jpg",
  "https://free-images.com/or/b30e/shanghai_community_activities_141684.jpg" /*
  "https://cdn.dribbble.com/users/3281732/screenshots/11192830/media/7690704fa8f0566d572a085637dd1eee.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/9165292/media/ccbfbce040e1941972dbc6a378c35e98.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/11205211/media/44c854b0a6e381340fbefe276e03e8e4.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/7003560/media/48d5ac3503d204751a2890ba82cc42ad.jpg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/6727912/samji_illustrator.jpeg?compress=1&resize=1200x1200",
  "https://cdn.dribbble.com/users/3281732/screenshots/13661330/media/1d9d3cd01504fa3f5ae5016e5ec3a313.jpg?compress=1&resize=1200x1200",*/,
];

export default function WelcomeScreen() {
  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme } = useTheme();
  // 2. Pass the theme to the styles function
  const styles = getStyles(effectiveTheme);
  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <ThemeCycleButton></ThemeCycleButton>
        <ImageCarousel data={imageData} />
        <WelcomeContent />
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
      justifyContent: "center",
      backgroundColor: colors.background,
    },
  });
};
