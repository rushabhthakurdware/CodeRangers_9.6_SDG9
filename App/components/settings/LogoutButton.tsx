import React from "react";
import { Button, Alert } from "react-native";
import SettingItem from "@/components/common/SettingItem";
import { useAuth } from "@/hooks/useAuth";
// Assuming useAuth hook provides logout logic
// import { useAuth } from '@/hooks/useAuth';

export default function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "OK",
        onPress: () => {
          console.log("Logging out...");
          logout();
        },
      },
    ]);
  };

  return (
    <SettingItem label="Account">
      <Button title="Logout" color="orange" onPress={handleLogout} />
    </SettingItem>
  );
}
