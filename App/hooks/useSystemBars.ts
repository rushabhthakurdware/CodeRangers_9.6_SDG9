// This file is hooks/useSystemBars.ts

import { useEffect } from "react";
import { Platform } from "react-native";
// FIX 1: Import the default export (you can name it whatever you want, EdgeToEdge is conventional)
import EdgeToEdge from "react-native-edge-to-edge";
import { useTheme } from "@/context/ThemeContext";

type BarStyle = "light" | "dark";

interface SystemBarOptions {
    /** Style for the status bar icons (clock, battery). */
    statusBar?: BarStyle;
    /** Style for the navigation bar icons (back, home, recents). Android only. */
    navigationBar?: BarStyle;
}

/**
 * A hook to independently control Status and Navigation Bar styles for edge-to-edge layouts.
 */
export const useSystemBars = (options?: SystemBarOptions) => {
    const { effectiveTheme } = useTheme();

    useEffect(() => {
        // Determine the default style based on the current theme
        const defaultStyle: BarStyle = effectiveTheme === "dark" ? "light" : "dark";

        // Use the override from the options object, or fall back to the theme default
        const finalStatusBarStyle = options?.statusBar ?? defaultStyle;
        const finalNavBarStyle = options?.navigationBar ?? defaultStyle;

        // FIX 2: Call the functions as methods on the default export
        EdgeToEdge.setStatusBarStyle(finalStatusBarStyle);

        // Apply the style to the Navigation Bar (Android only)
        if (Platform.OS === "android") {
            // FIX 3: Call this as a method as well
            EdgeToEdge.setNavigationBarColor({
                light: finalNavBarStyle === "light", // `true` for light icons, `false` for dark
            });
        }
    }, [effectiveTheme, options?.statusBar, options?.navigationBar]);
};