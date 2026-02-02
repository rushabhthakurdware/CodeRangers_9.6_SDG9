import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import PostDetails from "@/components/reports/PostDetails";
import BackButton from "@/components/common/BackButton";
import { Location, Post } from "@/lib/types";
import { useTheme } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeCycleButton from "@/components/theming/ThemeCycleButton";
import MapView from "@/components/maps/MapView";
import { useStylePalette } from "@/constants/StylePalette";

export default function PostDetailScreen() {
  const { post: postString } = useLocalSearchParams<{ post: string }>();
  const { userName: userName } = useLocalSearchParams<{ userName: string }>();
  // ✅ Get the theme at the top of the component
  const { effectiveTheme } = useTheme();
  // ✅ Pass the theme to the styles function
  const cstyles = getStyles(effectiveTheme);
  const styles = useStylePalette();
  console.log("FETCHED REPORT:", postString);
  // If for some reason the post data isn't passed, show a themed error.
  if (!postString) {
    return (
      // ✅ Styles are now applied from your dynamic stylesheet
      <View style={cstyles.centered}>
        <SafeAreaView
          edges={["top", "left", "right", "bottom"]}
          style={{ flex: 1 }}
        >
          <Text style={cstyles.errorText}>Post data not found.</Text>
        </SafeAreaView>
      </View>
    );
  }

  const post: Post = JSON.parse(postString);
  const headerIconColor = effectiveTheme === "dark" ? "#FFFFFF" : "#000000";

  return (
    <>
      <ThemeCycleButton></ThemeCycleButton>
      <Stack.Screen
        options={{
          title: post.title,
        }}
      />

      <PostDetails post={post} userName={userName} />

      {/**<MapView
  latitude={selectedPost.latitude}
  longitude={selectedPost.longitude}
  theme={theme}
/> */}
    </>
  );
}

// ✅ The stylesheet now includes styles for the error message
const getStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";

  return StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: isDark ? "#121212" : "#FFFFFF",
    },
    errorText: {
      fontSize: 16,
      color: isDark ? "#A0A0A0" : "#666666",
    },
  });
};
