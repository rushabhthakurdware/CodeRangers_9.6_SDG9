import { useStylePalette } from "@/constants/StylePalette";
import { useTheme } from "@/hooks/useTheme";
import React from "react";
// Import Text and MediaPicker
import { View, TextInput, StyleSheet, Text } from "react-native";
import MediaPicker from "./MediaPicker"; // Assuming MediaPicker is in the same folder
import { MediaItem } from "@/lib/types"; // Import your MediaItem type
import LocationPicker from "../common/LocationPicker";

// 1. Update the props
type ReportFormProps = {
  title: string;
  setTitle: (text: string) => void;
  description: string;
  setDescription: (text: string) => void;
  // --- ADD THESE ---
  mediaList: MediaItem[];
  onPickMedia: () => void;
  onCaptureMedia: () => void;
  onMeasureDepth?: () => void;
  onAutoDetect?: () => void;
  location: { lat: number; lng: number } | null;
  isFetchingLocation: boolean;
  onFetchLocation: () => void;
};

export default function ReportForm({
  title,
  setTitle,
  description,
  setDescription,
  // --- ADD THESE ---
  mediaList,
  onPickMedia,
  onCaptureMedia,
  onMeasureDepth,
  onAutoDetect,
  location,
  isFetchingLocation,
  onFetchLocation,
}: ReportFormProps) {
  const { colors } = useTheme();
  const styles = useStylePalette();

  return (
    <View>
      <TextInput
        style={[styles.input]}
        placeholder="Enter Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={colors.PlaceholderText}
      />
      <TextInput
        style={[styles.input, { height: 60 }]}
        placeholder="Enter Description"
        value={description}
        onChangeText={setDescription}
        placeholderTextColor={colors.PlaceholderText}
        multiline
        numberOfLines={3}
      />
      <LocationPicker
        location={location}
        loading={isFetchingLocation}
        onFetchLocation={onFetchLocation}
      />
      {/* 2. Add the MediaPicker and its surrounding UI */}
      <View style={[styles.separator, {}]} />
      <Text
        style={[
          styles.subtitle,
          {
            textAlign: "center",
            marginBottom: 10,
          },
        ]}
      >
        Add Photos and Videos
      </Text>
      <MediaPicker
        mediaList={mediaList}
        onPickMedia={onPickMedia}
        onCaptureMedia={onCaptureMedia}
        onMeasureDepth={onMeasureDepth}
        onAutoDetect={onAutoDetect}
      />
      <View style={[styles.separator, {}]} />
    </View>
  );
}
