/**
 * This file contains the raw, non-themed color values for the entire application.
 * These are the foundational "crayons" used to build the themed color palettes.
 */
/*
export const Palette = (theme: "light" | "dark") => {

    const isDark = theme === "dark";
    // Brand Colors
    // brandGreen: "#ffffffab",


    };

    /*
        // Semantic Colors
        //Navigation Button colors
    
        darkproceedbuttoncolor: "#4CAF50",
        lightproceedbuttoncolor: "#4CAF50",
        darkcreatebuttoncolor: "#459cff",
        lightcreatebuttoncolor: "#007BFF",
        //Theme button colors
        darkthemebuttoncolor: "#202020ff",
        darkthemebuttonborder: "#f3ffefff",
        lighttheembuttoncolor: "#f3ffefff",
        lighttheembuttonborder: "#202020ff",

};*/
/**
 * This function generates a theme-aware color object.
 */



/**p1
 * #FF6500
 * #1E3E62
 * #0B192C
 * #000B58
 */
export const Palette = (theme: "light" | "dark") => {
    const isDark = theme === "dark";

    //commons
    const colors = {
        // General
        background: isDark ? "#000000ff" : "#fffae4",
        profileBackground: isDark ? "#dd7129" : "#fdfad2ff",
        tabBackground: isDark ? "#000000ff" : "#fffbecff",
        text: isDark ? "#eeeeecff" : "#11181C",
        title: isDark ? "#FFFFFF" : "#333333",
        subtitle: isDark ? "#FFFFFF" : "#333333",
        subbackground: isDark ? "#ffffff04" : "#fdf7d2ff",
        // Inputs
        inputBorder: isDark ? "#555555" : "#ccccccff",
        inputText: isDark ? "#FFFFFF" : "#000000",
        Inputbackground: isDark ? "#68686869" : "#ffffffff",
        PlaceholderText: isDark ? "#FFFFFF" : "#000000",

        // Semantic Colors
        textAdmin: isDark ? "#FF6B6B" : "#D90000",
        textSuccess: isDark ? "#69DB7C" : "#006400",

        // Buttons
        buttonLoginBg: isDark ? "#dd7129" : "#dd7129",
        buttonCreateBg: isDark ? "#007BFF" : "#007BFF",
        mediaAddButton: isDark ? "#007BFF" : "#007BFF",
        buttonText: "#fafcffff",
        proceedbuttoncolor: isDark ? "#4CAF50" : "#4CAF50",
        buttonborder: isDark ? "#4CAF50" : "#4CAF50",

        // Add your theme button colors here from the comments
        themeButton: isDark ? "#202020ff" : "#f3ffefff",
        themeBorder: isDark ? "#f3ffefff" : "#202020ff",

        //gradients
        welcomeGradientEnd: isDark ? "#000000ff" : "#d2fdd4ff",

        //Home Nav Bar    // --- Tab Bar Colors ---
        card: isDark ? "#13263bff" : "#fdd87d",
        border: isDark ? "#343A40" : "#DEE2E6",
        tabLabelActive: isDark ? "#FFFFFF" : "#000000",
        tabLabelInactive: isDark ? "#585858ff" : "#3a3f39ff",
        tabIconActive: isDark ? "#007BFF" : "#007BFF",
        tabIconInactive: isDark ? "#585858ff" : "#ADB5BD",

        //Card Colors
        //Card1
        cardBackground: isDark ? "#000842ff" : "#ffeec3ff",
        cardTitle: isDark ? "#FFFFFF" : "#000000",
        CardDescription: isDark ? "#d6d6d6ff" : "#1f1f1fff",
        cardDate: isDark ? "#84e6ffff" : "#121f22ff",

    };

    // ✅ YOU MUST RETURN THE OBJECT
    return colors;
};

// Also export the TypeScript type of our color object
export type AppColorPalette = ReturnType<typeof Palette>;