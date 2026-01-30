import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useStylePalette } from '@/constants/StylePalette';
import { useTheme } from '@/hooks/useTheme';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  onLogin: () => void;
  onNavigateToRegister: () => void;
  loading?: boolean;
}

export default function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  onLogin,
  onNavigateToRegister,
  loading = false,
}: LoginFormProps) {
  const styles = useStylePalette();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Text style={styles.title}>Login</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={colors.inputBorder}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={colors.inputBorder}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.buttonLoginBg }]}
            onPress={onLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#6c757d' }]}
            onPress={onNavigateToRegister}
          >
            <Text style={styles.buttonText}>Go to Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
