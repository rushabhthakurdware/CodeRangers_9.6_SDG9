import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { useTheme } from "@/context/ThemeContext";

export const useNavigationBar = () => {
  const { effectiveTheme } = useTheme();

  useEffect(() => {
    const setupNavBar = async () => {
      // ✅ Make sure the navigation bar is always visible
      await NavigationBar.setVisibilityAsync("visible");

      // Set the background color to match the theme
      await NavigationBar.setBackgroundColorAsync(
        effectiveTheme === "dark" ? "#121212" : "#FFFFFF"
      );

      // Set the button/icon style
      await NavigationBar.setButtonStyleAsync(
        effectiveTheme === "dark" ? "light" : "dark"
      );
    };

    setupNavBar();
  }, [effectiveTheme]); // Rerun whenever the theme changes
};
