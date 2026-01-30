export type LanguageCode = 'en' | 'es' | 'fr' | 'hi';

export interface MediaItem {
    url: string;
    type: 'image' | 'video';
    id: string;
}

export interface LocationData {
    latitude: number;
    longitude: number;
    address?: string;
}

export interface Post {
    id: string;
    title: string;
    description: string;
    media: MediaItem[];
    location: LocationData | null;
    createdAt: string;
    createdByName?: string;
    status?: 'pending' | 'resolved' | 'rejected';
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'citizen' | 'admin';
}

export interface TranslationStrings {
    [key: string]: any;
}