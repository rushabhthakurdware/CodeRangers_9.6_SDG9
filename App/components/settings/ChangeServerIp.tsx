import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useServerConfig } from "@/context/ServerConfigContext"; // Import our context hook
import SettingItem from "@/components/common/SettingItem"; // The generic wrapper
import { useTheme } from "@/hooks/useTheme";

export default function ServerConfigSetting() {
  // 1. Get the current IP and the function to show the modal from the context
  const { currentIp, showModal } = useServerConfig();
  const { colors } = useTheme();

  return (
    // 2. Use the SettingItem component for a consistent layout
    <SettingItem label="Server Address">
      {/* 3. The interactive part of the setting */}
      <TouchableOpacity onPress={showModal} style={styles.pressableArea}>
        <Text style={[styles.ipText, { color: colors.text }]}>
          {currentIp || "Tap to set"}
        </Text>
      </TouchableOpacity>
    </SettingItem>
  );
}

const styles = StyleSheet.create({
  pressableArea: {
    height: 50,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 10,
  },
  ipText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
