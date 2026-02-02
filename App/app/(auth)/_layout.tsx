import { useAuth } from "@/hooks/useAuth";
import { Redirect, Stack } from "expo-router";
import { Platform, SafeAreaView, StatusBar, Text } from "react-native";

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Text>Loading...</Text>; // Or a splash screen
  }

  if (user) {
    return <Redirect href="/home" />; // Redirect to the home tab in the main app
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
