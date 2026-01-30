import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Switch } from 'react-native';
import { useStylePalette } from '@/constants/StylePalette';
import { useTheme } from '@/hooks/useTheme';

interface RegisterFormProps {
  username: string;
  setUsername: (username: string) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isAdmin: boolean;
  toggleAdmin: () => void;
  onRegister: () => void;
  onNavigateToLogin: () => void;
  loading?: boolean;
}

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
  loading = false,
}: RegisterFormProps) {
  const styles = useStylePalette();
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Text style={styles.title}>Register</Text>

        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={colors.inputBorder}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

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

          <View style={localStyles.switchContainer}>
            <Text style={[localStyles.switchLabel, { color: colors.text }]}>
              Register as Admin
            </Text>
            <Switch value={isAdmin} onValueChange={toggleAdmin} />
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.buttonCreateBg }]}
            onPress={onRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#6c757d' }]}
            onPress={onNavigateToLogin}
          >
            <Text style={styles.buttonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
  },
});
