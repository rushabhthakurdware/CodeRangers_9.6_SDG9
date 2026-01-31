import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  UserData,
  saveUser,
  loadUser,
  clearUser,
} from "@/lib/storage/userStorage";
import { login, LoginCredentials } from "@/lib/api/userService";
import { router } from "expo-router";

// ✅ 1. Add login and logout to the type definition
type AuthContextType = {
  user: UserData | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
};

// 2. Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. Create the custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// 4. Create the Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Automatically set a mock user to bypass login for new flow
        const mockUser = { id: '1', name: 'Citizen', token: 'mock-token', email: 'user@civic.com' };
        setUser(mockUser);
      } finally {
        setLoading(false);
      }
    };
    checkUserStatus();
  }, []);

  // ✅ 5. Define the login logic
  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      const userData = await login(credentials);
      await saveUser(userData);
      setUser(userData);
      router.replace("/home");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // ✅ 6. Define the logout logic
  const handleLogout = async () => {
    await clearUser();
    setUser(null);
    router.replace("/(public)");
  };

  // ✅ 7. Add the login and logout functions to the provider's value
  const value = {
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
