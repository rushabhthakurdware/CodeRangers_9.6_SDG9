import React from "react";
// 1. Import the native components from the library you installed
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View } from "react-native";
import { useTheme } from "../../hooks/useTheme"; // Your existing theme hook

// The component's props do not change
interface MapViewProps {
  latitude: number;
  longitude: number;
}

export default function MapViewComponent({
  latitude,
  longitude,
}: MapViewProps) {
  const { effectiveTheme } = useTheme();

  // The region object tells the map where to center and at what zoom level
  const region = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.04, // Smaller numbers = more zoomed in
    longitudeDelta: 0.02,
  };

  // 2. Return the native <MapView> component, not an <iframe>
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // Use Google Maps on both iOS and Android
        style={styles.map}
        region={region}
        // Apply a dark style to the map's base tiles when in dark mode
        customMapStyle={effectiveTheme === "dark" ? mapDarkStyle : []}
      >
        {/* Add a Marker to show a pin at the exact coordinates */}
        <Marker
          coordinate={{ latitude: latitude, longitude: longitude }}
          title="Selected Location"
        />
      </MapView>
    </View>
  );
}

// 3. Use StyleSheet.create for React Native styling
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    borderRadius: 0, // Apply border radius to the container
    overflow: "hidden", // Ensure the map respects the container's border radius
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

// A standard style JSON for dark-themed Google Maps
const mapDarkStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];
