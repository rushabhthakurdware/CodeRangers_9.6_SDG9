import axios from 'axios';
import { loadUser } from '../storage/userStorage';

// 1. Initialize with a placeholder URL.
// This will cause an obvious error if the IP is not set, which is good for debugging.
const apiClient = axios.create({
    baseURL: 'http://placeholder-url.com/api',
});

// 2. Create and export a function to update the baseURL at runtime.
export const setApiBaseUrl = (ipAddress: string) => {
    // Make sure to include the port and /api path
    apiClient.defaults.baseURL = `http://192.168.0.99:5000/api`;
    console.log(`API base URL set to: ${apiClient.defaults.baseURL}`);
};

// Your interceptor for adding the auth token remains unchanged.
apiClient.interceptors.request.use(
    async (config) => {
        const user = await loadUser();
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;