import { useRouter } from 'expo-router';

export function useChoiceNavigation() {
    const router = useRouter();

    const navigateToRegister = () => {
        router.push('/(auth)/register');
    };

    const navigateToLogin = (type?: string) => {
        router.push('/(auth)/login');
    };

    const navigateBack = () => {
        router.back();
    };

    return {
        navigateToRegister,
        navigateToLogin,
        navigateBack,
    };
}
