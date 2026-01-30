import { useState } from 'react';
import { Alert } from 'react-native';

// Mock hook - manages create report form state without backend calls
export function useCreateReportForm() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [media, setMedia] = useState<any[]>([]);
    const [location, setLocation] = useState<any>(null);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);
    const [loading, setLoading] = useState(false);

    // Mock media picker
    const pickMedia = () => {
        console.log('Pick media clicked (mock)');
        Alert.alert('Info', 'Media picker - mock implementation');
    };

    // Mock camera capture
    const captureMedia = () => {
        console.log('Capture media clicked (mock)');
        Alert.alert('Info', 'Camera capture - mock implementation');
    };

    // Mock location fetch
    const fetchLocation = () => {
        setIsFetchingLocation(true);
        setTimeout(() => {
            setLocation({
                latitude: 40.7128,
                longitude: -74.0060,
                address: 'Mock Location, City',
            });
            setIsFetchingLocation(false);
            Alert.alert('Success', 'Location fetched (mock)');
        }, 1000);
    };

    // Mock save post
    const savePost = () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert('Error', 'Please fill in title and description');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Success', 'Report created successfully!');

            // Reset form
            setTitle('');
            setDescription('');
            setMedia([]);
            setLocation(null);
        }, 1000);
    };

    return {
        title,
        setTitle,
        description,
        setDescription,
        media,
        pickMedia,
        captureMedia,
        location,
        isFetchingLocation,
        fetchLocation,
        loading,
        savePost,
    };
}
