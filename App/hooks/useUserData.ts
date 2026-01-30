import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { loadUser, UserData } from '@/lib/storage/userStorage';

export function useUserData() {
    const [user, setUser] = useState<UserData | null>(null);

    useFocusEffect(
        useCallback(() => {
            loadUser().then(setUser);
        }, [])
    );

    return user;
}