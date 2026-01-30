import { ThemeProvider } from "@/context/ThemeContext";
import { Stack, Redirect } from "expo-router";

// Simplified root layout without authentication
export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="index" />
      </Stack>
    </ThemeProvider>
  );
}
