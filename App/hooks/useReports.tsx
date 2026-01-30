import { useState } from 'react';

// Mock hook - returns static report data without backend calls
export function useReports() {
    // Mock reports data
    const mockPosts = [
        {
            id: '1',
            title: 'Road Damage Report',
            description: 'Large pothole on Main Street near the park. It is very deep and dangerous for cyclists and small cars.',
            media: [
                { url: 'https://picsum.photos/400/300?random=1', type: 'image', id: 'm1' }
            ],
            location: {
                latitude: 40.7128,
                longitude: -74.0060,
                address: 'Main Street, City'
            },
            createdAt: new Date().toISOString(),
            createdByName: 'John Citizen',
        },
        {
            id: '2',
            title: 'Street Light Not Working',
            description: 'Street light has been out for 3 days on Oak Avenue. The whole block is very dark at night.',
            media: [
                { url: 'https://picsum.photos/400/300?random=2', type: 'image', id: 'm2' }
            ],
            location: {
                latitude: 40.73061,
                longitude: -73.935242,
                address: 'Oak Avenue, City'
            },
            createdAt: new Date().toISOString(),
            createdByName: 'Mary Smith',
        },
    ];

    return {
        posts: mockPosts,
        loading: false,
    };
}
