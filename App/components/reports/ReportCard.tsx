import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Post } from "@/lib/types";
import { useTheme } from "@/hooks/useTheme";
import { useStylePalette } from "@/constants/StylePalette";

type ReportCardProps = {
  post: Post;
};

export default function ReportCard({ post }: ReportCardProps) {
  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme, colors } = useTheme();
  // 2. Pass the theme to the styles function
  const cstyles = getStyles(effectiveTheme);
  const styles = useStylePalette();
  return (
    <View style={cstyles.postCard}>
      <Text style={cstyles.title}>{post.title}</Text>
      <Text style={cstyles.description}>{post.description}</Text>
      {post.media.length > 0 && (
        <Image source={{ uri: post.media[0].url }} style={cstyles.mediaImage} /> //server gives url not uri
      )}
      <Text style={cstyles.date}>
        Posted on: {new Date(post.createdAt).toLocaleString()}
      </Text>
    </View>
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
      height: 200, // Adjust height as needed
      borderRadius: 5,
      resizeMode: "cover",
      marginBottom: 10,
    },
    date: {
      fontSize: 12,
      textAlign: "right",
      color: colors.cardDate,
    },
  });
};
