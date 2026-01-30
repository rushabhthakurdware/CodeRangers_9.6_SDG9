import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'expo-router';

interface AuthContextType {
    user: { name: string; role: string } | null;
    loading: boolean;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();

    const logout = () => {
        console.log("Mock Logout");
        router.replace('/(public)'); // Updated to match folder group name properly
    };

    const value = {
        user: { name: 'Test User', role: 'citizen' },
        loading: false,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Mock useAuth hook - returns context
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        // Fallback for parts of the app not wrapped yet or simple usage
        return {
            user: { name: 'Test User', role: 'citizen' },
            loading: false,
            logout: () => console.log("Mock Logout Fallback"),
        };
    }
    return context;
}

