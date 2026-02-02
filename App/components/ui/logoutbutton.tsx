//import { clearUser } from "@/utils/userStorage";
import { useRouter } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    //await clearUser();
    Alert.alert("Logged out", "You have been logged out.");
    router.replace("/");
  };

  return (
    <TouchableOpacity style={styles.option} onPress={handleLogout}>
      <Text style={styles.optionText}>Logout</Text>
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
    color: "yellow",
  },
});
