import React from "react";
import { Button, Alert } from "react-native";
import SettingItem from "@/components/common/SettingItem";

export default function DeleteAccountButton() {
  const handleDelete = () => {
    Alert.alert(
      "Delete Account",
      "This action is permanent and cannot be undone. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            console.log("Deleting account...");
          },
        },
      ]
    );
  };

  return (
    <SettingItem label="Danger Zone">
      <Button title="Delete Account" color="red" onPress={handleDelete} />
    </SettingItem>
  );
}
