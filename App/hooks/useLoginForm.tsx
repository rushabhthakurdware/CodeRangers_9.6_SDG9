import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';

export function useLoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);

        // Simulate a delay for the "login" process
        setTimeout(() => {
            setLoading(false);

            // Show success dialog then redirect
            Alert.alert(
                'Success',
                'Connected successfully!',
                [{
                    text: 'OK',
                    onPress: () => router.push('/(tabs)/home')
                }]
            );
        }, 1000);
    };

    const navigateToRegister = () => {
        router.push('/(auth)/register');
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        navigateToRegister,
        type: 'citizen',
        loading,
    };
}
