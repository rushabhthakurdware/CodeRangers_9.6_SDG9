// hooks/useCreateReportForm.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import { createReport } from '@/lib/api/reportService';
import { LocationCoords, MediaItem } from '@/lib/types';
import * as Location from 'expo-location';
export function useCreateReportForm() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [mediaList, setMediaList] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);

    // 2. Add state for location
    const [location, setLocation] = useState<LocationCoords | null>(null);
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

    const fetchLocation = async () => {
        setIsFetchingLocation(true);
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Please enable location services to use this feature.');
                return;
            }

            let locationData = await Location.getCurrentPositionAsync({});
            setLocation({
                lat: locationData.coords.latitude,
                lng: locationData.coords.longitude,
            });
        } catch (error) {
            console.error("Error fetching location:", error);
            Alert.alert("Error", "Could not fetch location.");
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
            let errorMessage = "Please fill all required fields.";
            if (!location) {
                errorMessage = "Please fetch your location before submitting the report.";
            }
            Alert.alert("Incomplete Report", errorMessage);

            return false;
        }
        setLoading(true);
        try {
            const response = await createReport(
                title,
                description,
                // Replace with actual coordinates from a location picker
                //{ lat: 21.0077, lng: 75.5626, address: "Nagpur" }, // Example: Jalgaon coordinates
                location,
                // ✅ Use a valid category from your schema's enum list
                "pothole",
                mediaList // Pass the first media item
            );
            if (response) {
                Alert.alert("Success", "Report submitted successfully!");
                setTitle("");
                setDescription("");
                setMediaList([]);
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
        isFetchingLocation,
        fetchLocation,
        depth,
        isDepthModalVisible,
        openDepthMeasurement,
        closeDepthMeasurement,
        handleDepthMeasurement,
    };
}