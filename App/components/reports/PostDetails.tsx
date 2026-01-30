import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import { Post } from "@/lib/types";
import { useTheme } from "@/context/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView from "react-native-maps";
import MapViewComponent from "@/components/maps/MapView";
import { useStylePalette } from "@/constants/StylePalette";
import CollapsibleView from "../common/CollapsableView";

export default function PostDetails({
  post,
  userName,
}: {
  post: Post;
  userName?: string;
}) {
  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme } = useTheme();
  // 2. Pass the theme to the styles function
  const cstyles = getStyles(effectiveTheme);
  const styles = useStylePalette();
  console.log("specific post", post);
  return (
    <View style={styles.container}>
      <SafeAreaView
        edges={["top", "left", "right", "bottom"]}
        style={{ flex: 1 }}
      >
        <ScrollView style={cstyles.container}>
          <View style={cstyles.contentContainer}>
            <Text style={cstyles.title}>{post.title}</Text>

            <View style={[styles.separator, { marginVertical: 3 }]} />
            <Text style={cstyles.creator}>
              By: {userName ? userName : post.createdBy.name}
            </Text>
            <Text style={cstyles.date}>
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
            {/*
            <View style={[styles.mapContainer, {}]}>
              
            </View>*/}

            {post.media && post.media.length > 0 && (
              <FlatList
                data={post.media} // The array of images to display
                renderItem={({ item }) => (
                  // This function renders one image for each item in the data array
                  <Image
                    source={{ uri: item.url }} //server gives url not uri
                    style={cstyles.scrollableMediaImage} // Use a new style for list items
                  />
                )}
                keyExtractor={(item) => item.url} // Provides a unique key for each image //server gives url not uri
                horizontal={true} // This is the key prop to enable horizontal scrolling
                showsHorizontalScrollIndicator={false} // Hides the scrollbar for a cleaner look
                contentContainerStyle={cstyles.mediaListContainer} // Style for the list itself
              />
            )}
            <CollapsibleView title="View Location on Maps">
              <View style={[styles.mapContainer, {}]}>
                <MapViewComponent
                  latitude={post.location.lat}
                  longitude={post.location.lng}
                />
              </View>
            </CollapsibleView>
            <View style={[styles.separator, { marginVertical: 5 }]} />
            <Text style={cstyles.description}>{post.description}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// 3. This function creates the StyleSheet based on the current theme
const getStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? "#121212" : "#FFFFFF",
    },
    mediaImage: {
      width: "100%",
      height: 250,
    },
    contentContainer: {
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 8,
      color: isDark ? "#FFFFFF" : "#000000",
    },
    date: {
      fontSize: 14,
      color: isDark ? "#A0A0A0" : "#777777",
      marginBottom: 16,
    },
    creator: {
      fontSize: 14,
      color: isDark ? "#A0A0A0" : "#777777",
      marginBottom: 5,
    },
    description: {
      fontSize: 16,
      lineHeight: 24,
      color: isDark ? "#E0E0E0" : "#333333",
    },
    mediaListContainer: {
      // Add some padding if you want space at the start of the list
      paddingVertical: 10,
    },
    scrollableMediaImage: {
      width: 320, // Give each image a fixed width
      height: 200, // Match the height of your original image
      borderRadius: 8,
      marginRight: 15, // Add space between the images
      resizeMode: "cover",
    },
  });
};
