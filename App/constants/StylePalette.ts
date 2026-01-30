import { useMemo } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext'; // Your existing theme hook

const { width, height } = Dimensions.get('window');

/**
 * A custom hook that returns a theme-aware global stylesheet.
 * This is the "stylesheet version" of your useTheme hook.
 */
export const useStylePalette = () => {
    // 1. Get the current, theme-aware colors object.
    const { colors, effectiveTheme } = useTheme();

    // 2. Memoize the StyleSheet creation.
    // This is critical for performance. The styles will only be
    // re-created when the theme (and thus, the colors) change.
    const styles = useMemo(() =>
        StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: "center",
                backgroundColor: colors.background, // Applied dynamic background
                width: "100%",
            }, tabcontainer: {
                flex: 1,
                justifyContent: "center",
                backgroundColor: colors.tabBackground, // Applied dynamic background
                width: "100%",
            },
            mapContainer: {
                flex: 1,
                justifyContent: "center",
                backgroundColor: colors.background, // Applied dynamic background
                width: "100%",
                height: height * 0.3,
            },
            title: {
                fontSize: 28,
                fontWeight: "bold",
                marginBottom: 30,
                color: colors.title,
                textAlign: "center",
            },
            container2: {
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: colors.subbackground, // Applied dynamic background
            },
            simpleButton: {
                backgroundColor: colors.buttonLoginBg, // Applied dynamic green
                padding: 5,
                borderRadius: 8,
                alignItems: "center",
                margin: 10,
            },
            loginButton: {
                backgroundColor: colors.buttonLoginBg, // Applied dynamic green
                padding: 15,
                borderRadius: 8,
                width: width * 0.8,
                alignItems: "center",
                marginTop: 10,
            },
            createButton: {
                backgroundColor: colors.buttonCreateBg, // Applied dynamic blue
                padding: 15,
                borderRadius: 8,
                width: width * 0.8,
                alignItems: "center",
                marginTop: 0,
            },
            buttonText: {
                color: colors.buttonText,
                fontSize: 16,
                fontWeight: "bold",
            },
            subtitle: {
                fontSize: 16,
                color: colors.subtitle,
                marginBottom: 30,
                textAlign: "center",
            },
            subtitle1: {
                fontSize: 18,
                color: colors.subtitle,
                marginBottom: 10,
                marginTop: 10,
                textAlign: "center",
            },
            subtitle2: {
                fontSize: 14,
                color: colors.subtitle,
                marginBottom: 5,
                textAlign: "justify",
            },
            input: {
                borderWidth: 1,
                borderColor: colors.inputBorder, // Applied dynamic border
                backgroundColor: colors.Inputbackground, // Ensure input bg matches theme
                color: colors.inputText, // Applied dynamic text color
                padding: 10,
                width: width * 0.9,
                marginBottom: 15,
                borderRadius: 8, alignSelf: "center",
            },
            boxborder: {
                borderWidth: 1,
                borderColor: colors.inputBorder, // Applied dynamic border
                backgroundColor: colors.Inputbackground, // Ensure input bg matches theme
                color: colors.inputText, // Applied dynamic text color
                borderRadius: 8,
            }, adminNote: {
                color: colors.textAdmin, // Applied dynamic admin red
                margin: 10,
                textAlign: "center",
            },
            userNote: {
                color: colors.textSuccess, // Applied dynamic user green
                margin: 10,
                textAlign: "center",
                width: width * 0.8,
            },
            separator: {
                height: 1, // Makes it a thin line
                width: '100%',
                backgroundColor: colors.border, // A light gray color, adjust as needed
                alignSelf: 'center', // Centers the line
                marginVertical: 20,  // Space above and below the line
            },
        }),
        [colors, effectiveTheme]); // 3. Dependencies for the memoization

    // 4. Return the complete, themed stylesheet
    return styles;
};