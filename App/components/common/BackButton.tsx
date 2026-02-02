import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // A popular icon set

type BackButtonProps = {
  /** Optional custom styles for the button container */
  style?: ViewStyle;
  /** The color of the back arrow icon */
  color?: string;
  /** The size of the back arrow icon */
  size?: number;
};

export default function BackButton({
  style,
  color = "#007BFF", // Default color
  size = 28, // Default size
}: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    // Check if the router can go back
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.button,
        { opacity: pressed ? 0.5 : 1.0 },
        style,
      ]}
      hitSlop={10} // Makes the button easier to tap
    >
      <Ionicons name="arrow-back" size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 30, // Makes the press feedback circular
  },
});
