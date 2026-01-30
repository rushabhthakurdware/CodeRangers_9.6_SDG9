import { vars } from "nativewind";
import { ThemeData } from "./themeData";

// Here we define the actual color values for our light and dark themes.
export const themes = {
    light: vars<ThemeData>({
        '--background': 'white',
        '--foreground': 'black',
        '--primary': '#007BFF',
        '--card': '#F3F4F6', // A light gray
        '--card-foreground': '#1F2937', // A dark gray
    }),
    dark: vars<ThemeData>({
        '--background': '#111827', // A very dark gray
        '--foreground': 'white',
        '--primary': '#3B82F6', // A lighter blue for dark mode
        '--card': '#1F2937', // A dark gray
        '--card-foreground': '#F3F4F6', // A light gray
    }),
};