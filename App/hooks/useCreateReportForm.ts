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

    // 4. Add state for auto-detect modal
    const [isAutoDetectModalVisible, setIsAutoDetectModalVisible] = useState(false);
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

    const openAutoDetect = () => {
        setIsAutoDetectModalVisible(true);
    };

    const closeAutoDetect = () => {
        setIsAutoDetectModalVisible(false);
    };

    const handleDepthMeasurement = (measuredDepth?: number, measuredWidth?: number, measuredArea?: number, aiDescription?: string) => {
        setDepth(measuredDepth || null);
        console.log('📝 handleDepthMeasurement Received:', { measuredDepth, measuredWidth, measuredArea, aiDescription });

        // Build measurement details text
        let measurementText = `[📏 Crack/Pothole Measurements]\n`;

        // Depth
        if (measuredDepth !== undefined) {
            measurementText += `• Length/Depth: ${measuredDepth.toFixed(1)} cm\n`;
        }

        // Width
        if (measuredWidth !== undefined) {
            console.log('Measured width exists:', measuredWidth);
            measurementText += `• Width/Diameter: ${measuredWidth.toFixed(1)} cm\n`;
        }

        // Area: Use provided area OR calculate if BOTH dimensions exist
        let areaVal = "";
        if (measuredArea !== undefined) {
            areaVal = measuredArea.toFixed(4);
            measurementText += `• Area: ${areaVal} m²\n`;
        } else if (measuredDepth !== undefined && measuredWidth !== undefined) {
            // Fallback calc
            areaVal = (measuredDepth * measuredWidth / 10000).toFixed(4);
            measurementText += `• Area (Est. Rect): ${areaVal} m²\n`;
        }

        // Clean up trailing newline
        measurementText = measurementText.trim();

        // Add AI Description if available
        if (aiDescription) {
            console.log('Appending AI description');
            measurementText += `\n\n• AI Description:\n${aiDescription}`;
        }

        // Append measurements to description
        setDescription((prevDesc) => {
            // Remove old measurement data if exists
            const cleanDesc = prevDesc.replace(/\[📏 Crack\/Pothole Measurements\][\s\S]*?(?=\[|$)/g, '').trim();

            // Add new measurements
            const newDesc = cleanDesc
                ? `${cleanDesc}\n\n${measurementText}`
                : measurementText;
            return newDesc;
        });
    };


    const savePost = async () => {
        if (!location) {
            Alert.alert("Missing Information", "Please allow location access to submit a report.");
            return false;
        }

        setLoading(true);
        try {
            // Construct the full payload for the new backend
            const payload = {
                location: {
                    lat: location.lat,
                    lon: location.lng,
                },
                asset: {
                    type: "road", // Default asset type
                    geometry: {
                        area_m2: depth && 0.0, // Placeholder if no area, can be enhanced
                    },
                },
                ar_measurements: {
                    crack_length_cm: depth || 0,
                    crack_width_mm: 0, // We need to capture width separately if available
                    surface_deformation: "moderate", // Default or user-selected
                    has_ar_reference: depth !== null,
                },
                crowd_reports: [
                    {
                        lat: location.lat,
                        lon: location.lng,
                        time: new Date().toISOString(),
                    },
                ],
                // Additional metadata
                description: description,
                title: title,
                days_unresolved: 1, // Default
            };

            console.log("🚀 Submitting FULL Payload to /analyze-complete:", JSON.stringify(payload, null, 2));

            // Import apiService dynamically to avoid circular dependencies if any
            const { apiService } = require('@/lib/api/apiClient');

            const response = await apiService.analyzeIssue(payload);

            console.log("✅ Analysis Result:", response.data);

            if (response.data && response.data.status === 'success') {
                Alert.alert("Success", "Report analyzed and submitted successfully!");
                setTitle("");
                setDescription("");
                setMediaList([]);
                setLocation(null);
                setLocationAddress(null);
                setDepth(null);
                return true;
            } else {
                Alert.alert("Notice", "Report submitted but server returned: " + (response.data?.message || "Unknown status"));
                return true;
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            Alert.alert("Error", "Failed to connect to backend. Check connection.");
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
        isAutoDetectModalVisible,
        openAutoDetect,
        closeAutoDetect,
    };
}