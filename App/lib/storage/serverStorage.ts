import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVER_IP_STORAGE_KEY = '@serverIpAddress';

export const saveServerIp = async (ip: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(SERVER_IP_STORAGE_KEY, ip);
    } catch (e) {
        console.warn('Failed to save server IP to storage', e);
    }
};

export const loadServerIp = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(SERVER_IP_STORAGE_KEY);
    } catch (e) {
        console.warn('Failed to load server IP from storage', e);
        return null;
    }
};