import { useAuth } from "@/hooks/useAuth";
import { Redirect, Stack } from "expo-router";
import { Platform, SafeAreaView, StatusBar } from "react-native";

export default function PublicLayout() {
  const { user, loading } = useAuth();
  if (user) {
    return <Redirect href="/home" />; // Redirect to the home tab in the main app
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
