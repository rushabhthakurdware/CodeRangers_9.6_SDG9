import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { getMyReports, Report, editMyReport } from '@/lib/api/reportService';
import { Post } from '@/lib/types';
import { Alert } from 'react-native';

export function useUserReports() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // This function remains the same
    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            // 1. Fetch the raw report data from the API
            const reports: Report[] = await getMyReports(); // 'Report' should match the server schema

            // 2. Map the server data to the client-side 'Post' type
            const formattedPosts: Post[] = reports.map((report) => ({
                // --- Direct Mappings ---
                id: report._id,
                title: report.title,
                description: report.description,
                createdAt: report.createdAt,

                // --- Mappings for Optional Fields with Defaults ---

                // The 'Report' type has no 'updatedAt', so we use 'createdAt' as a fallback.
                updatedAt: report.createdAt,

                // If location is missing from the API response, default to a known location (e.g., Nagpur).
                // This prevents the map component from crashing.
                location: report.location || { lat: 21.1458, lng: 79.0882, address: 'Nagpur, MH' },

                // Default to 'other' and 'submitted' if these fields are missing.
                // The 'as Post['category']' cast tells TypeScript that our default value is valid.
                category: (report.category || 'other') as Post['category'],
                status: (report.status || 'submitted') as Post['status'],

                // --- User Details Mappings ---
                createdBy: {
                    id: report.createdBy._id,
                    name: report.createdBy.name,
                    email: report.createdBy.email,
                    role: report.createdBy.role,
                },
                createdByName: report.createdByName,
                assignedTo: report.assignedTo,
                // --- Transformed Media Array ---
                // The old 'photoUrl' is replaced with the new 'media' array.
                // We map each item, changing 'url' to 'uri' for the client.
                media: (report.media || []).map(mediaItem => ({
                    url: mediaItem.url,
                    type: mediaItem.type as 'image' | 'video', // Ensure type correctness
                    //name: mediaItem.name,
                })),
                /*
                backwards compatibility
                 media: (() => {
        // PRIORITY 1: Check for the new `media` array first.
        // This ensures that if a report has the new structure, we use it.
        if (report.media && report.media.length > 0) {
            return report.media.map(mediaItem => ({
                uri: mediaItem.url, // Mapping server `url` to client `uri`
                type: mediaItem.type as 'image' | 'video',
                name: mediaItem.name, 
            }));
        }

        // PRIORITY 2: Fallback for older reports that only have `photoUrl`.
        // This will only run if `report.media` is missing or empty.
        if (report.photoUrl) {
            return [{ uri: report.photoUrl, type: 'image', name: 'report-image' }];
        }

        // FINAL FALLBACK: If neither exists, return an empty array.
        return [];
    })(),
                */
            }));
            console.log("before formating", reports[0]);
            console.log("after formating", formattedPosts[0]);
            setPosts(formattedPosts);
        } catch (error) {
            console.error("Error loading posts:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // This part remains correct and does not need to be changed
    useFocusEffect(
        useCallback(() => {
            fetchPosts();
        }, [fetchPosts])
    );

    // ✅ FIX: Update the post in the local state for a faster UI response
    const updatePost = async (id: string, title: string, description: string) => {
        const updatedReport = await editMyReport(id, title, description);

        if (updatedReport) {
            // Instead of re-fetching, update the specific post in the array
            setPosts(currentPosts =>
                currentPosts.map(post =>
                    post.id === updatedReport._id
                        ? { ...post, title: updatedReport.title, description: updatedReport.description }
                        : post
                )
            );
            Alert.alert("Success", "Report updated successfully!");
        } else {
            Alert.alert("Error", "Failed to update report.");
        }
    };

    return { posts, loading, updatePost };
}