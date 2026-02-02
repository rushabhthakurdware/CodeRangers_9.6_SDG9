import React from "react";

// Define the component's props
interface MapViewProps {
  latitude: number;
  longitude: number;
  theme: "light" | "dark";
}

/**
 * A presentational component that displays an embedded Google Map
 * for a given latitude and longitude.
 */
export default function MapView({ latitude, longitude, theme }: MapViewProps) {
  const styles = getStyles(theme);

  // Construct the Google Maps embed URL dynamically using the props
  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div style={styles.container}>
      <iframe
        src={mapUrl}
        style={styles.mapFrame}
        title="Embedded Location Map"
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}

/**
 * Generates the styles for the component based on the provided theme.
 */
export const getStyles = (theme: "light" | "dark") => {
  const isDark = theme === "dark";

  const colors = {
    border: isDark ? "#444" : "#e0e0e0",
  };

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      width: "100%",
      height: "100%",
      borderRadius: "12px",
      overflow: "hidden",
      border: `1px solid ${colors.border}`,
    },
    mapFrame: {
      width: "100%",
      height: "100%",
      border: "none",
    },
  };

  return styles;
};
