import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useTheme } from "../../hooks/useTheme"; // Assuming you have this hook

// This is required for LayoutAnimation to work on Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Define the props the component will accept
type CollapsibleViewProps = {
  title: string;
  children: React.ReactNode;
};

export default function CollapsibleView({
  title,
  children,
}: CollapsibleViewProps) {
  const { effectiveTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = getStyles(effectiveTheme);

  const toggleExpand = () => {
    // This function animates the layout changes
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      {/* The clickable header bar */}
      <TouchableOpacity onPress={toggleExpand} style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        {/* The arrow icon changes direction based on state */}
        <Text style={styles.icon}>{isExpanded ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {/* The content area that will be shown or hidden */}
      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

// Theme-aware styles for the component
const getStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";
  return StyleSheet.create({
    container: {
      backgroundColor: isDark ? "#2a2a2a" : "#ffffff",
      borderRadius: 4,
      marginBottom: 10,
      overflow: "hidden", // Ensures content respects the border radius
      borderWidth: 1,
      borderColor: isDark ? "#444" : "#e0e0e0",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 5,
      paddingHorizontal: 15,
    },
    headerText: {
      fontSize: 16,
      fontWeight: "400",
      color: isDark ? "#e0e0e0" : "#1a1a1a",
    },
    icon: {
      fontSize: 16,
      color: isDark ? "#999" : "#555",
    },
    content: {
      paddingHorizontal: 10,
      paddingBottom: 5,
    },
  });
};
