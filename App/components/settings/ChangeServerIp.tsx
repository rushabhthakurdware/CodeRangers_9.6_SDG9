import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import SettingItem from "@/components/common/SettingItem"; // The generic wrapper
import { useTheme } from "@/hooks/useTheme";

export default function ServerConfigSetting() {
  const [currentIp, setCurrentIp] = useState("192.168.1.1");
  const { colors } = useTheme();

  const showModal = () => {
    Alert.alert("Server Config", "Mock server configuration modal");
  };

  return (
    <SettingItem label="Server Address">
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
