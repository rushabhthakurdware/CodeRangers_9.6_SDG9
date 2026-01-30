import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type ChoiceButtonProps = {
  title: string;
  onPress: () => void;
  color?: string;
};

export default function ChoiceButton({
  title,
  onPress,
  color,
}: ChoiceButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
