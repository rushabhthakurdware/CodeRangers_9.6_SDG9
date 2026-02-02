import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { register as apiRegister } from '@/lib/api/userService';
import { saveUser } from '@/lib/storage/userStorage';

export function useRegisterForm() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!username || !email || !password) {
            Alert.alert("Missing Information", "Please fill out all fields.");
            return;
        }
        setLoading(true);
        try {
            const role = isAdmin ? 'admin' : 'citizen';
            const user = await apiRegister(username, email, password, role);
            await saveUser(user);
            Alert.alert("Success!", `Welcome, ${user.name}!`);
            router.replace('/home'); // Navigate after successful registration
        } catch (error: any) {
            Alert.alert("Registration Failed", error.message || "An unknown error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const navigateToLogin = () => {
        router.replace({ pathname: "/login", params: { type: "citizen" } });
    };

    return {
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        isAdmin,
        toggleAdmin: () => setIsAdmin(!isAdmin),
        handleRegister,
        navigateToLogin,
        loading,
    };
}