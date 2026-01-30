import { useState } from 'react';

// Mock hook - returns static report data without backend calls
export function useReports() {
    // Mock reports data
    const mockPosts = [
        {
            id: '1',
            title: 'Road Damage Report',
            description: 'Large pothole on Main Street near the park',
            media: [],
            location: null,
            createdAt: new Date().toISOString(),
            createdByName: 'Test User',
        },
        {
            id: '2',
            title: 'Street Light Not Working',
            description: 'Street light has been out for 3 days on Oak Avenue',
            media: [],
            location: null,
            createdAt: new Date().toISOString(),
            createdByName: 'Test User',
        },
        {
            id: '3',
            title: 'Garbage Collection Issue',
            description: 'Bins not collected this week',
            media: [],
            location: null,
            createdAt: new Date().toISOString(),
            createdByName: 'Test User',
        },
    ];

    return {
        posts: mockPosts,
        loading: false,
    };
}
