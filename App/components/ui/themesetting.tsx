import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function ThemeSetting() {
  const handlePress = () => {
    Alert.alert("Theme", "Change theme here.");
  };

  return (
    <TouchableOpacity style={styles.option} onPress={handlePress}>
      <Text style={styles.optionText}>Theme Settings</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  option: {
    padding: 15,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 18,
  },
});
