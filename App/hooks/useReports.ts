import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from 'expo-router';
// Assuming `getReportById` exists alongside `getReports` in your service file
import { getReports, getReportById, Report } from '@/lib/api/reportService';
import { Post } from '@/lib/types';

/**
 * Fetches and manages a list of all reports.
 */
export function useReports() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const reports: Report[] = await getReports();
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
                    _id: report.createdBy._id,
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
            }));

            setPosts(formattedPosts);
        } catch (err: any) {
            console.error("Error loading posts:", err);
            setError("Failed to load reports.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Re-fetch posts whenever the screen comes into focus
    useFocusEffect(
        useCallback(() => {
            fetchPosts();
        }, [fetchPosts])
    );

    return { posts, loading, error, refetch: fetchPosts };
}

// --- NEW HOOK ADDED BELOW ---

/**
 * Fetches a single report by its ID.
 * @param id The ID of the report to fetch.
 */
export function useReportById(id: string | undefined) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }

        const fetchReport = async () => {
            // Reset state when a new ID is fetched to avoid showing stale data
            setLoading(true);
            setError(null);

            try {
                const reports: Report[] = await getReportById(id);

                // Format the raw API data into the 'Post' shape your components expect
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
                        email: report.createdBy.email,
                        name: report.createdBy.name,
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
                }));

                setPosts(formattedPosts);


            } catch (e) {
                setError(e as Error);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]); // Rerun the effect if the ID changes

    return { posts, loading, error };
}