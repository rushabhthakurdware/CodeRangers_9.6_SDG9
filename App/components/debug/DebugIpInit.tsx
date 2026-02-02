import React, { useState, useEffect, ReactNode } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { setApiBaseUrl } from "@/lib/api/apiClient";
import { loadServerIp, saveServerIp } from "@/lib/storage/serverStorage";
import ServerConfigModal from "./ServerConfigModal"; // Assuming modal is in the same folder

type AppInitializerProps = {
  children: ReactNode;
};

export default function AppInitializer({ children }: AppInitializerProps) {
  // 1. All the state and logic is moved here from RootLayout
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [isIpLoading, setIsIpLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      const savedIp = await loadServerIp();
      if (savedIp) {
        setApiBaseUrl(savedIp);
        setCurrentIp(savedIp);
      }
      setIsIpLoading(false);
    };
    initializeApp();
  }, []);

  const handleSaveIp = async (ip: string) => {
    await saveServerIp(ip);
    setApiBaseUrl(ip);
    setCurrentIp(ip);
    setIsModalVisible(false);
  };

  const handleSkip = () => {
    console.log(
      "Skipping IP configuration for offline mode. API calls will fail."
    );
    setIsModalVisible(false);
  };

  // 2. The component controls the entire startup flow
  if (isIpLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isModalVisible) {
    return (
      <>
        <View style={styles.container} />
        <ServerConfigModal
          visible={isModalVisible}
          onSave={handleSaveIp}
          onSkip={handleSkip}
          currentIp={currentIp}
        />
      </>
    );
  }

  // 3. Once the modal is dismissed, it renders the actual app
  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
  },
});
