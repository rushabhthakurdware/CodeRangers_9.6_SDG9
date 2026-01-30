import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

export function useRegisterForm() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const toggleAdmin = () => {
        setIsAdmin(!isAdmin);
    };

    const handleRegister = async () => {
        setLoading(true);

        // Simulate a delay for the "registration" process
        setTimeout(() => {
            setLoading(false);

            // Show success dialog then redirect to tabs
            Alert.alert(
                'Success',
                'Account created successfully!',
                [{
                    text: 'OK',
                    onPress: () => router.push('/(tabs)/home')
                }]
            );
        }, 1000);
    };

    const navigateToLogin = () => {
        router.push('/(auth)/login');
    };

    return {
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        isAdmin,
        toggleAdmin,
        handleRegister,
        navigateToLogin,
        loading,
    };
}
