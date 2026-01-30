// hooks/useCreateReportForm.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import { createReport } from '@/lib/api/reportService';
import { LocationCoords, MediaItem } from '@/lib/types';
import * as Location from 'expo-location';
import { reverseGeocode } from '@/utils/geocoding';
export function useCreateReportForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);

    // 2. Add state for location
    const [location, setLocation] = useState<LocationCoords | null>(null);
    const [locationAddress, setLocationAddress] = useState<string | null>(null);
    const [isFetchingLocation, setIsFetchingLocation] = useState(false);

    // 3. Add state for depth measurement
    const [depth, setDepth] = useState<number | null>(null);
    const [isDepthModalVisible, setIsDepthModalVisible] = useState(false);
    const pickMedia = async () => {
        /*
        let result = await ImagePicker.launchImageLibraryAsync({
            // To fix your warning, use 'MediaTypeOptions'
            mediaTypes: 
            allowsEditing: true,
            allowsMultipleSelection: true, // Make sure this is true
            quality: 1,
        });*/
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert("Permission required", "Allow access to media library.");
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],

            allowsMultipleSelection: true, // Make sure this is true
            //allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled && result.assets) {
            const supportedAssets = result.assets.filter(asset =>
                asset.type === 'image' || asset.type === 'video'
            );
            // 1. 'result.assets' is an array. We must map over it.
            const newItems = supportedAssets.map(asset => ({
                uri: asset.uri,
                name: asset.fileName || `media-${Date.now()}`,
                // We can now be 100% confident that the type is 'image' or 'video'
                type: asset.type as 'image' | 'video',
            }));
            /*
            if (!result.canceled && result.assets) {
                        // 1. 'result.assets' is an array. We must map over it.
                        const newItems = result.assets.map(asset => ({
                            uri: asset.uri,
                            name: asset.fileName || `media-${Date.now()}`,
                            type: asset.type || 'image', // 'image' or 'video'
                        }));
            
                        // 2. Update the state with the new items
                        setMediaList(prevList => [...prevList, ...newItems]);
                    }                         
            
            */
            // 2. Update the state with the new items
            console.log("media", newItems);
            setMediaList(prevList => [...prevList, ...newItems]);
        }
    };
    const captureMedia = async () => {
        // Request camera permissi"ons first
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera permissions to make this work!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images', 'videos'],

            //allowsMultipleSelection: true, // Make sure this is true
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets) {
            const supportedAssets = result.assets.filter(asset =>
                asset.type === 'image' || asset.type === 'video'
            );
            // 1. 'result.assets' is an array. We must map over it.
            const newItems = supportedAssets.map(asset => ({
                uri: asset.uri,
                name: asset.fileName || `media-${Date.now()}`,
                // We can now be 100% confident that the type is 'image' or 'video'
                type: asset.type as 'image' | 'video',
            }));

            // 2. Update the state with the new items
            setMediaList(prevList => [...prevList, ...newItems]);
        }
    };

    // 4. Fetch location using expo-location
    const fetchLocation = async () => {
        setIsFetchingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Allow location access to get your current location.');
                setIsFetchingLocation(false);
                return;
            }
            const loc = await Location.getCurrentPositionAsync({});
            const coords = {
                lat: loc.coords.latitude,
                lng: loc.coords.longitude,
            };
            setLocation(coords);

            // Fetch address for the location
            try {
                console.log('🔍 Fetching address for coordinates...');
                const address = await reverseGeocode(coords.lat, coords.lng);
                if (address) {
                    const addressText = address.street ||
                        (address.city && address.state ? `${address.city}, ${address.state}` : '') ||
                        address.formattedAddress ||
                        `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;

                    setLocationAddress(addressText);
                    console.log('📍 Location Address:', addressText);

                    // Append address to description text field
                    setDescription((prevDesc) => {
                        // Check if address is already in description to avoid duplicates
                        if (prevDesc.includes(`[📍 ${addressText}]`)) {
                            return prevDesc;
                        }
                        // Add address to description with some spacing
                        const newDesc = prevDesc.trim()
                            ? `${prevDesc}\n\n[📍 Location: ${addressText}]`
                            : `[📍 Location: ${addressText}]`;
                        return newDesc;
                    });
                } else {
                    console.warn('⚠️ Could not fetch address from coordinates');
                }
            } catch (geocodeError) {
                console.error('❌ Failed to fetch address:', geocodeError);
                setLocationAddress(null);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Could not fetch location.');
        } finally {
            setIsFetchingLocation(false);
        }
    };

    const openDepthMeasurement = () => {
        setIsDepthModalVisible(true);
    };

    const closeDepthMeasurement = () => {
        setIsDepthModalVisible(false);
    };

    const handleDepthMeasurement = (measuredDepth: number, measuredWidth?: number) => {
        setDepth(measuredDepth);
        console.log('Measured depth:', measuredDepth);
        if (measuredWidth) {
            console.log('Measured width:', measuredWidth);
        }
    };


    const savePost = async () => {
        if (!title || !description || !location) {
            Alert.alert("Missing Information", "Please provide title, description, and location.");
            return false;
        }

        setLoading(true);
        try {
            console.log("Submitting report:", {
                title,
                description,
                location,
                locationAddress,
                depth
            });

            const response = await createReport(
                title,
                description, // Use description as-is (address already appended)
                location,
                "pothole",
                mediaList
            );

            if (response) {
                Alert.alert("Success", "Report submitted successfully!");
                setTitle("");
                setDescription("");
                setMediaList([]);
                setLocation(null);
                setLocationAddress(null);
                setDepth(null);
                return true;
            } else {
                Alert.alert("Error", "Failed to submit report.");
                return false;
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            Alert.alert("Error", "An unexpected error occurred.");
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        title,
        setTitle,
        description,
        setDescription,
        mediaList,
        loading,
        pickMedia,
        captureMedia,
        savePost,
        location,
        locationAddress,
        isFetchingLocation,
        fetchLocation,
        depth,
        isDepthModalVisible,
        openDepthMeasurement,
        closeDepthMeasurement,
        handleDepthMeasurement,
    };
}