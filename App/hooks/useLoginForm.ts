import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { login as apiLogin } from '@/lib/api/userService'; // Renamed to avoid conflict
import { saveUser } from '@/lib/storage/userStorage';
import { useAuth } from './useAuth'; // We'll use the login function from our auth context

export function useLoginForm() {
    const router = useRouter();
    const { login } = useAuth(); // Get the login function from the central auth context
    const { type } = useLocalSearchParams<{ type?: string }>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            // The login function from useAuth will handle the API call,
            // saving the user, and redirecting.
            await login({ email, password });
        } catch (error: any) {
            Alert.alert("Login Failed", error.message || "Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const navigateToRegister = () => {
        router.replace('/register');
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        navigateToRegister,
        type: type === 'admin' ? 'admin' : 'citizen', // Default to citizen
        loading,
    };
}