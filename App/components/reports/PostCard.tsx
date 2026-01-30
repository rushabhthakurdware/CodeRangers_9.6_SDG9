import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Link } from "expo-router";
import { Post } from "@/lib/types";
import { useTheme } from "@/hooks/useTheme";
import { useStylePalette } from "@/constants/StylePalette";

type PostCardProps = {
  post: Post;
  onEditPress?: () => void;
  userName?: string;
};

export default function PostCard({
  post,
  onEditPress,
  userName,
}: PostCardProps) {
  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme, colors } = useTheme();
  // 2. Pass the theme to the styles function
  const cstyles = getStyles(effectiveTheme);
  const styles = useStylePalette();
  return (
    // Wrap the card in a Link to make it navigable.
    // `asChild` passes the press handling to the child component (`Pressable`).
    <Link
      href={{
        pathname: `/posts/${post.id}`,
        // ✅ Pass the entire post object as a stringified parameter
        params: { post: JSON.stringify(post), userName },
      }}
      asChild
    >
      <Pressable>
        <View style={cstyles.postCard}>
          <Text style={cstyles.title}>{post.title}</Text>
          <Text style={cstyles.description}>{post.description}</Text>
          {post.media.length > 0 && (
            <Image
              source={{ uri: post.media[0].url }} //server gives url not uri
              style={cstyles.mediaImage}
            />
          )}
          <Text style={cstyles.date}>
            Posted on: {new Date(post.createdAt).toLocaleString()}
          </Text>
          {!onEditPress && (
            <Text style={cstyles.date}>Posted By: {post.createdByName}</Text>
          )}

          {/* For the button, we stop the press event from bubbling up to the Link */}
          {onEditPress && (
            <TouchableOpacity
              style={cstyles.editButton}
              onPress={(e) => {
                e.stopPropagation(); // This prevents the Link from navigating
                onEditPress();
              }}
            >
              <Text style={cstyles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    </Link>
  );
}

export const getStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";

  const { colors } = useTheme();
  return StyleSheet.create({
    postCard: {
      backgroundColor: colors.cardBackground,
      padding: 15,
      marginBottom: 20,
      borderRadius: 8,
      elevation: 3,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
      color: colors.cardTitle,
    },
    description: {
      fontSize: 14,
      marginBottom: 10,
      color: colors.CardDescription,
    },
    mediaImage: {
      width: "100%",
      height: 200,
      borderRadius: 5,
      resizeMode: "cover",
      marginBottom: 10,
    },
    date: {
      fontSize: 12,
      textAlign: "left",
      color: colors.cardDate,
    },
    editButton: {
      marginTop: 10,
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: "#007BFF",
      borderRadius: 5,
      alignSelf: "flex-end",
    },
    editButtonText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });
};
