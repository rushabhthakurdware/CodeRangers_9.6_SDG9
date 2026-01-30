import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export function useChoiceNavigation() {
    const router = useRouter();

    const navigateToRegister = useCallback(() => {
        router.push('/register');
    }, [router]);

    const navigateToLogin = useCallback((type: 'citizen' | 'admin') => {
        router.push({ pathname: '/login', params: { type } });
    }, [router]);

    const navigateBack = useCallback(() => {
        // Assuming the previous screen is the welcome screen at the root
        router.push('/');
    }, [router]);

    return {
        navigateToRegister,
        navigateToLogin,
        navigateBack,
    };
}