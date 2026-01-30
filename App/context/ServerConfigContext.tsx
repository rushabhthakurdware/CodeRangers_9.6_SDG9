import React, { createContext, useContext, useState, ReactNode } from "react";
import { Alert } from "react-native";

interface ServerConfigContextType {
    currentIp: string;
    isModalVisible: boolean;
    showModal: () => void;
    hideModal: () => void;
    saveIpAddress: (ip: string) => void;
}

const ServerConfigContext = createContext<ServerConfigContextType | undefined>(undefined);

export const ServerConfigProvider = ({ children }: { children: ReactNode }) => {
    const [currentIp, setCurrentIp] = useState("192.168.1.1");
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = () => setIsModalVisible(true);
    const hideModal = () => setIsModalVisible(false);

    const saveIpAddress = (ip: string) => {
        console.log("Mock: Saving IP address:", ip);
        setCurrentIp(ip);
        setIsModalVisible(false);
        Alert.alert("Success", `Server IP updated to ${ip} (Mocked)`);
    };

    return (
        <ServerConfigContext.Provider
            value={{
                currentIp,
                isModalVisible,
                showModal,
                hideModal,
                saveIpAddress,
            }}
        >
            {children}
        </ServerConfigContext.Provider>
    );
};

export const useServerConfig = () => {
    const context = useContext(ServerConfigContext);
    if (context === undefined) {
        throw new Error("useServerConfig must be used within a ServerConfigProvider");
    }
    return context;
};
