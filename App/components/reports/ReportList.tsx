import React from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { Post } from "@/lib/types";
import ReportCard from "./ReportCard";
import PostCard from "./PostCard";

type ReportListProps = {
  posts: Post[];
};

export default function ReportList({ posts }: ReportListProps) {
  if (posts.length === 0) {
    return <Text style={styles.noPosts}>No reports available</Text>;
  }
  {
    /*<ReportCard key={post.id} post={post} /> <PostCard key={post.id} post={post} />*/
  }
  return (
    <ScrollView contentContainerStyle={styles.containerpost}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ... styles for containerpost, noPosts
  containerpost: {
    paddingHorizontal: 10,
  },
  noPosts: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 50,
  },
});
