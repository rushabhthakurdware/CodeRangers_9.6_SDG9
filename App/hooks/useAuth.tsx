import { useRouter } from 'expo-router';

// Mock useAuth hook - no backend, no authentication
export function useAuth() {
    const router = useRouter();

    const logout = () => {
        console.log("Mock Logout");
        router.replace('/(public)/index');
    };

    return {
        user: { name: 'Test User', role: 'citizen' },
        loading: false,
        logout,
    };
}
