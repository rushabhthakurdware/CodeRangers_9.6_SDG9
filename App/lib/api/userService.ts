import apiClient from './apiClient';
import { UserData } from '../types';

export type LoginCredentials = {
    email: string;
    password: string;
};

export async function register(name: string, email: string, password: string, role = "citizen"): Promise<UserData> {
    const response = await apiClient.post('/auth/register', { name, email, password, role });
    return response.data;
}

export async function login(credentials: LoginCredentials): Promise<UserData> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
}

export async function getProfile(): Promise<UserData> {
    const response = await apiClient.get('/auth/profile');
    return response.data;
}