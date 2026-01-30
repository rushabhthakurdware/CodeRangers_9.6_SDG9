import { useTheme } from "@/hooks/useTheme";
import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeCycleButton from "../theming/ThemeCycleButton";
import { Palette } from "@/constants/Palette";
import { useStylePalette } from "@/constants/StylePalette";

type LoginFormProps = {
  //type: /*"admin" |*/ "citizen";
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onLogin: () => void;
  onNavigateToRegister: () => void;
};

const { width, height } = Dimensions.get("screen");
export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  onLogin,
  onNavigateToRegister,
}: LoginFormProps) {
  // 1. Get the effective theme ('light' or 'dark')
  const { effectiveTheme, colors } = useTheme();
  // 2. Pass the theme to the styles function
  //const cstyles = getStyles(effectiveTheme);
  const styles = useStylePalette();
  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1 }}>
        <ThemeCycleButton></ThemeCycleButton>
        <View style={styles.container2}>
          <Text style={styles.title}>
            Login as {/*type === "admin" ? "Admin" : */ "Citizen"}
          </Text>
          <TextInput
            placeholder="Enter email"
            placeholderTextColor={colors.PlaceholderText}
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.PlaceholderText}
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.subtitle2}></Text>
          <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.subtitle2}></Text>
          <Text style={styles.userNote}>
            New here, Click on below button to create your account.
          </Text>
          <>
            <TouchableOpacity
              style={styles.createButton}
              onPress={onNavigateToRegister}
            >
              <Text style={styles.buttonText}>No account? Register</Text>
            </TouchableOpacity>
          </>
          {/*type === "citizen" && (
            <>
              <TouchableOpacity
                style={styles.createButton}
                onPress={onNavigateToRegister}
              >
                <Text style={styles.buttonText}>No account? Register</Text>
              </TouchableOpacity>
              <Text style={styles.userNote}>
                Users can login with their registered email address.
              </Text>
            </>
          )*/}

          {/*type === "admin" && (
        <Text style={styles.adminNote}>
          Admins must enter credentials provided by the organization.
        </Text>
      )*/}
        </View>
      </SafeAreaView>
    </View>
  );
}
