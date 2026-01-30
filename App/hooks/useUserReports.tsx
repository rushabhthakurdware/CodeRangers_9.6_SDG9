import { useState } from 'react';

// Mock hook - returns user's reports without backend calls
export function useUserReports() {
    // Mock user reports data
    const [posts, setPosts] = useState([
        {
            id: '101',
            title: 'My First Report',
            description: 'This is a test report I submitted',
            media: [],
            location: null,
            createdAt: new Date().toISOString(),
            createdByName: 'Test User',
            status: 'pending',
        },
        {
            id: '102',
            title: 'Another Issue',
            description: 'Second report from my account',
            media: [],
            location: null,
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
