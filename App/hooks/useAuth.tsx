// Mock useAuth hook - no backend, no authentication
export function useAuth() {
    return {
        user: null,
        loading: false,
    };
}
