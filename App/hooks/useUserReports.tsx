import { useState } from 'react';

// Mock hook - returns user's reports without backend calls
export function useUserReports() {
    // Mock user reports data
    const [posts, setPosts] = useState([
        {
            id: '101',
            title: 'My First Report',
            description: 'This is a test report I submitted regarding the illegal dumping behind the mall.',
            media: [
                { url: 'https://picsum.photos/400/300?random=101', type: 'image', id: 'm101' }
            ],
            location: {
                latitude: 40.7128,
                longitude: -74.0060,
                address: 'Mall Backside, City'
            },
            createdAt: new Date().toISOString(),
            createdByName: 'Test User',
            status: 'pending',
        },
        {
            id: '102',
            title: 'Another Issue',
            description: 'Second report from my account - Water leakage on the sidewalk.',
            media: [
                { url: 'https://picsum.photos/400/300?random=102', type: 'image', id: 'm102' }
            ],
            location: {
                latitude: 40.73061,
                longitude: -73.935242,
                address: 'Sidewalk, City'
            },
            createdAt: new Date().toISOString(),
            createdByName: 'Test User',
            status: 'resolved',
        },
    ]);

    // Mock update post function
    const updatePost = (id: string, title: string, description: string) => {
        console.log('Updating post (mock):', id, title, description);

        // Update local state
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === id
                    ? { ...post, title, description }
                    : post
            )
        );
    };

    return {
        posts,
        loading: false,
        updatePost,
    };
}
