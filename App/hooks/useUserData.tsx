// Mock user data hook - no backend, returns static user data
export function useUserData() {
    return {
        name: 'User',
        email: 'user@example.com',
        id: '1',
    };
}
