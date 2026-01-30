import { removeUser } from "@/utils/userStorage";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function DeleteButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await removeUser();
    Alert.alert("Logged out", "You have been logged out.");
    router.replace("/");
  };

  return (
    <TouchableOpacity style={styles.option} onPress={handleLogout}>
      <Text style={styles.optionText}>Delete Account</Text>
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
    color: "red",
  },
});
