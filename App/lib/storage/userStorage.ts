import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserData } from '../types'; // Import from the central types file

const USER_KEY = "user_data";

/**
 * Saves user data to the device's local storage.
 * @param user The user data object to save.
 */
export async function saveUser(user: UserData): Promise<void> {
    try {
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
        console.log("User session saved to device.");
    } catch (error) {
        console.error("Error saving user to storage:", error);
    }
}

/**
 * Loads user data from the device's local storage.
 * @returns The user data object if found, otherwise null.
 */
export async function loadUser(): Promise<UserData | null> {
    try {
        const json = await AsyncStorage.getItem(USER_KEY);
        return json != null ? (JSON.parse(json) as UserData) : null;
    } catch (error) {
        console.error("Error loading user from storage:", error);
        return null;
    }
}

/**
 * Removes user data from the device's local storage (for logout).
 */
export async function clearUser(): Promise<void> {
    try {
        await AsyncStorage.removeItem(USER_KEY);
        console.log("User session cleared from device.");
    } catch (error) {
        console.error("Error clearing user from storage:", error);
    }
}

export { UserData };
