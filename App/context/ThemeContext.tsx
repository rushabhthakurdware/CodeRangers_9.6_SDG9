import { AppColorPalette, Palette } from "@/constants/Palette";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { useColorScheme, Appearance } from "react-native";

// ✅ The theme can now be one of three options
export type ThemeOption = "system" | "light" | "dark";
const THEME_STORAGE_KEY = "@userTheme";

type ThemeContextType = {
  themeOption: ThemeOption;
  effectiveTheme: "light" | "dark";
  colors: AppColorPalette;
  isThemeLoaded: boolean; // We add this so the app can wait for the theme
  setThemeOption: (option: ThemeOption) => void;
};
export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemTheme = useColorScheme() || "light";
  const [themeOption, setThemeOption] = useState<ThemeOption>("system");
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">(
    systemTheme
  );
  // Add a loading state to prevent a "theme flash" on startup
  const [isThemeLoaded, setIsThemeLoaded] = useState(false);

  // --- LOGIC TO LOAD THE SAVED THEME ON APP START ---
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedOption = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedOption) {
          setThemeOption(savedOption as ThemeOption);
        }
      } catch (e) {
        console.warn("Failed to load theme from storage", e);
      } finally {
        // Mark the theme as loaded so the app can render
        setIsThemeLoaded(true);
      }
    };

    loadSavedTheme();
  }, []);

  useEffect(() => {
    // Determine the actual theme to apply
    const currentTheme = themeOption === "system" ? systemTheme : themeOption;
    setEffectiveTheme(currentTheme);
  }, [themeOption, systemTheme]);

  // Listen for system changes to update the theme when in 'automatic' mode
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeOption === "system") {
        setEffectiveTheme(colorScheme || "light");
      }
    });
    return () => subscription.remove();
  }, [themeOption]);

  const updateAndSaveTheme = async (newOption: ThemeOption) => {
    try {
      // 1. Save the choice to the device disk
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newOption);
      // 2. Update the React state
      setThemeOption(newOption);
    } catch (e) {
      console.warn("Failed to save theme choice", e);
    }
  };
  const colors = Palette(effectiveTheme);
  if (!isThemeLoaded) {
    return null;
  }
  return (
    <ThemeContext.Provider
      value={{
        themeOption,
        effectiveTheme,
        colors,
        isThemeLoaded,
        setThemeOption: updateAndSaveTheme, // Use the new save function
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
