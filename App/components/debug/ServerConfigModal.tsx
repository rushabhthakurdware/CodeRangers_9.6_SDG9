import { useStylePalette } from "@/constants/StylePalette";
import { useTheme } from "@/hooks/useTheme";
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  Pressable,
} from "react-native";

type ServerConfigModalProps = {
  visible: boolean;
  onSave: (ip: string) => void;
  onSkip: () => void; // 1. Add a new prop for the skip action
  currentIp?: string | null;
};
export default function ServerConfigModal({
  visible,
  onSave,
  onSkip,
  currentIp,
}: ServerConfigModalProps) {
  const [ip, setIp] = useState(currentIp || "");

  useEffect(() => {
    if (currentIp) {
      setIp(currentIp);
    }
  }, [currentIp]);

  const handleSave = () => {
    if (ip.trim()) {
      onSave(ip.trim());
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Configure Server IP</Text>
          <Text style={styles.subtitle}>
            Confirm or update the server IP for this session.
          </Text>
          <Text style={styles.subtitle}>
            Note:- Type "localhost" for localhost.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. = 192.168.1.10"
            value={ip}
            onChangeText={setIp}
            keyboardType="default"
            //keyboardType={Platform.OS === "ios" ? "decimal-pad" : "numeric"}
          />
          <Button title="Save and Connect" onPress={handleSave} />

          {/* 2. Add the Skip button using a Pressable for custom styling */}
          <Pressable onPress={onSkip} style={styles.skipButton}>
            <Text style={styles.skipButtonText}>Skip for Offline Mode</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "85%",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    textAlign: "center",
  },
  skipButton: {
    marginTop: 15,
  },
  skipButtonText: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: "underline",
  },
});
