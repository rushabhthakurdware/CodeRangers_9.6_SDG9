import { useContext } from "react";
// Point to the new context we just created
import { ThemeContext } from "@/context/ThemeContext";

// This hook is now a simple wrapper around our custom context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
}
