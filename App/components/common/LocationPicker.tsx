import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { useStylePalette } from "@/constants/StylePalette";

const { width, height } = Dimensions.get("window");
// Define the component's props
type LocationPickerProps = {
  onFetchLocation: () => void;
  location: { lat: number; lng: number } | null;
  loading: boolean;
};

export default function LocationPicker({
  onFetchLocation,
  location,
  loading,
}: LocationPickerProps) {
  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme, colors } = useTheme();
  // 2. Pass the theme to the styles function
  const cstyles = getStyles(effectiveTheme);
  const styles = useStylePalette();

  return (
    <View style={cstyles.container}>
      <TouchableOpacity
        style={[
          styles.simpleButton,
          {
            backgroundColor: colors.mediaAddButton,
            paddingVertical: 8,
            padding: 0,
            width: width * 0.45,
          },
        ]}
        onPress={onFetchLocation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.buttonText, { textAlign: "center" }]}>
            Get Current Location
          </Text> //📍
        )}
      </TouchableOpacity>
      <View style={[styles.boxborder, cstyles.locationDisplay]}>
        <Text style={cstyles.locationText}>
          {location
            ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
            : "No location set."}
        </Text>
      </View>
    </View>
  );
}

const getStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      marginVertical: 0,
    },
    button: {
      width: width * 0.4,
      padding: 7,
      borderRadius: 5,
      alignItems: "center",
    },
    buttonText: {
      color: "#ffffff",
      fontSize: 16,
      fontWeight: "600",
    },
    locationDisplay: {
      width: width * 0.46,
      marginTop: 0,
      paddingVertical: 10,
      backgroundColor: isDark ? "#2a2a2a" : "#f0f0f0",
      borderRadius: 6,
    },
    locationText: {
      textAlign: "center",
      color: isDark ? "#ccc" : "#555",
    },
  });
};
