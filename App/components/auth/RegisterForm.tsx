import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Checkbox } from "@futurejj/react-native-checkbox";
import { useTheme } from "@/hooks/useTheme";
import ThemeCycleButton from "../theming/ThemeCycleButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { Palette } from "@/constants/Palette";
import { useStylePalette } from "@/constants/StylePalette";

type RegisterFormProps = {
  username: string;
  setUsername: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isAdmin: boolean;
  toggleAdmin: () => void;
  onRegister: () => void;
  onNavigateToLogin: () => void;
};

const { width, height } = Dimensions.get("screen");
export default function RegisterForm({
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  isAdmin,
  toggleAdmin,
  onRegister,
  onNavigateToLogin,
}: RegisterFormProps) {
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
          <Text style={styles.title}>Register 📝</Text>
          <TextInput
            placeholder="Enter name"
            placeholderTextColor={colors.PlaceholderText}
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
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
            placeholder="Enter password"
            placeholderTextColor={colors.PlaceholderText}
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          {/*<View style={styles.checkboxContainer}>
        <Checkbox
          status={isAdmin ? "checked" : "unchecked"}
          onPress={toggleAdmin}
        />
        <Text style={styles.label}>Admin? (For testing)</Text>
      </View>*/}

          <Text style={styles.subtitle2}></Text>
          <TouchableOpacity style={styles.createButton} onPress={onRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <Text style={styles.subtitle2}></Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={onNavigateToLogin}
          >
            <Text style={styles.buttonText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}
