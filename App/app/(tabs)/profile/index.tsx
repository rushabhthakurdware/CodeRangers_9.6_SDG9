import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useUserData } from "@/hooks/useUserData";
import { useUserReports } from "@/hooks/useUserReports";
import { Post } from "@/lib/types";
import PostCard from "@/components/reports/PostCard";
import EditPostModal from "@/components/reports/EditPostModal";
import ThemeCycleButton from "@/components/theming/ThemeCycleButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/useTheme";
import { useStylePalette } from "@/constants/StylePalette";

export default function ProfileScreen() {
  const user = useUserData();
  const { posts, loading, updatePost } = useUserReports();

  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme, colors } = useTheme();
  // 2. Pass the theme to the styles function
  const cstyles = getStyles(effectiveTheme);
  const styles = useStylePalette();

  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);

  const handleEditPress = (post: Post) => {
    setCurrentPost(post);
    setEditModalVisible(true);
  };

  const handleSave = (id: string, title: string, description: string) => {
    updatePost(id, title, description);
    setEditModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.tabcontainer}>
        <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
          <ThemeCycleButton style={{ opacity: 0 }}></ThemeCycleButton>
          <Text style={cstyles.loadingText}>Loading...</Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.tabcontainer}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        <ThemeCycleButton style={{ opacity: 0 }}></ThemeCycleButton>

        {/* --- ADD THIS USER INFO BLOCK --- */}
        {user && (
          <View style={cstyles.userInfoContainer}>
            {/* 1. Profile Icon */}
            <View style={cstyles.profileIcon}>
              <Text style={cstyles.profileIconText}>👤</Text>
            </View>

            {/* 2. User Text Info */}
            <View style={cstyles.userInfoTextContainer}>
              <Text
                style={[
                  styles.title,
                  { marginBottom: 3, textAlignVertical: "top" },
                ]}
              >
                {user.name}
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { marginBottom: 3, textAlign: "left" },
                ]}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                >
                  Role:
                </Text>{" "}
                {user.role}
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { marginBottom: 0, textAlign: "left" },
                ]}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    textDecorationLine: "underline",
                  }}
                >
                  Total Reports:
                </Text>{" "}
                {posts.length}
              </Text>
            </View>
          </View>
        )}
        {/* 👤--- END OF USER INFO BLOCK --- */}
        <View style={[styles.separator, {}]} />
        <Text style={[styles.title, { marginBottom: 5 }]}>
          My Submitted Reports
        </Text>
        <ScrollView style={{ width: "90%", alignSelf: "center" }}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                userName={user?.name}
                onEditPress={() => handleEditPress(post)}
              />
            ))
          ) : (
            <Text style={styles.subtitle}>No reports available</Text>
          )}
        </ScrollView>

        <EditPostModal
          visible={isEditModalVisible}
          onClose={() => setEditModalVisible(false)}
          postToEdit={currentPost}
          onSave={handleSave}
        />
      </SafeAreaView>
    </View>
  );
}

export const getStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";

  const { colors } = useTheme();
  const profilesize = 40;
  return StyleSheet.create({
    userInfoContainer: {
      flexDirection: "row", // Lays out icon and text side-by-side
      alignItems: "center", // Vertically centers the icon with the text block
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginBottom: 20,
      backgroundColor: colors.profileBackground,
      borderRadius: 10,
      alignSelf: "center",
      width: "95%",
    },

    // ADD this new style for the icon
    profileIcon: {
      width: profilesize * 2,
      height: profilesize * 2,
      borderRadius: profilesize, // Makes it a circle
      backgroundColor: "#e0e0e0", // A light grey background
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15, // Space between icon and text
    },

    // ADD this new style for the icon's text (the emoji)
    profileIconText: {
      fontSize: profilesize,
    },

    // ADD this new style to wrap the text
    userInfoTextContainer: {
      flex: 1, // Ensures text block takes up remaining space
    },
    container: {
      flex: 1,
    },
    text: {
      fontSize: 22,
      fontWeight: "bold",
      textAlign: "center",
      padding: 16,
    },
    loadingText: {
      flex: 1,
      textAlign: "center",
      textAlignVertical: "center",
    },
    noPosts: {
      textAlign: "center",
      fontSize: 16,
      marginTop: 50,
    },
  });
};
