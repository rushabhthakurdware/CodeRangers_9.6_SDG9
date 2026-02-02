import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { setApiBaseUrl } from "@/lib/api/apiClient";
import { loadServerIp, saveServerIp } from "@/lib/storage/serverStorage";

// 1. Define the shape of the context's data and functions
type ServerConfigContextType = {
  currentIp: string | null;
  isModalVisible: boolean;
  showModal: () => void;
  hideModal: () => void;
  saveIpAddress: (ip: string) => Promise<void>;
};

const ServerConfigContext = createContext<ServerConfigContextType | undefined>(
  undefined
);

// 2. Create the provider component that will hold the actual state and logic
export function ServerConfigProvider({ children }: { children: ReactNode }) {
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Load the initial IP when the app starts
  useEffect(() => {
    const initializeIp = async () => {
      const savedIp = await loadServerIp();
      if (savedIp) {
        setApiBaseUrl(savedIp);
        setCurrentIp(savedIp);
      }
    };
    initializeIp();
  }, []);

  const showModal = () => setIsModalVisible(true);
  const hideModal = () => setIsModalVisible(false);

  const saveIpAddress = async (ip: string) => {
    await saveServerIp(ip);
    setApiBaseUrl(ip);
    setCurrentIp(ip);
    hideModal();
  };

  const value = {
    currentIp,
    isModalVisible,
    showModal,
    hideModal,
    saveIpAddress,
  };

  return (
    <ServerConfigContext.Provider value={value}>
      {children}
    </ServerConfigContext.Provider>
  );
}

// 3. Create a custom hook for easy access to the context
export function useServerConfig() {
  const context = useContext(ServerConfigContext);
  if (context === undefined) {
    throw new Error(
      "useServerConfig must be used within a ServerConfigProvider"
    );
  }
  return context;
}
