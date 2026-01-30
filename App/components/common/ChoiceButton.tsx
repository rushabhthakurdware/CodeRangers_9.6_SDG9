import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ChoiceButtonProps {
  title: string;
  onPress: () => void;
  color: string;
}

export default function ChoiceButton({ title, onPress, color }: ChoiceButtonProps) {
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
    width: '100%',
    maxWidth: 300,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
