import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MapViewComponent from "./MapView";

interface LocationCardProps {
  latitude: number;
  longitude: number;
}

/**
 * A native component that displays a map for a given location.
 */
export default function LocationCard({ latitude, longitude }: LocationCardProps) {
  return (
    <View style={styles.container}>
      <MapViewComponent latitude={latitude} longitude={longitude} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
});
