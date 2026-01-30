import Constants from 'expo-constants';

// Try multiple ways to access the API key
const API_KEY_FROM_CONSTANTS = Constants.expoConfig?.extra?.googleMapsApiKey;
const API_KEY_FROM_ENV = process.env.GOOGLE_MAPS_API_KEY;
const HARDCODED_KEY = 'AIzaSyAQpmevpmGGA0liNLg6NP9AOOiDVqQD9-w'; // From your .env file

const GOOGLE_MAPS_API_KEY = API_KEY_FROM_CONSTANTS || API_KEY_FROM_ENV || HARDCODED_KEY;

console.log('🔑 API Key Debug:');
console.log('  - From Constants:', API_KEY_FROM_CONSTANTS ? '✅ Found' : '❌ Not found');
console.log('  - From process.env:', API_KEY_FROM_ENV ? '✅ Found' : '❌ Not found');
console.log('  - Using:', GOOGLE_MAPS_API_KEY ? `✅ ${GOOGLE_MAPS_API_KEY.substring(0, 20)}...` : '❌ None');

export interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

export interface GeocodingResult {
    address_components: AddressComponent[];
    formatted_address: string;
    place_id: string;
}

export interface LocationAddress {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    formattedAddress: string;
}

/**
 * Reverse geocode coordinates to get address information
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Address information including street name, city, state, etc.
 */
export const reverseGeocode = async (
    latitude: number,
    longitude: number
): Promise<LocationAddress | null> => {
    console.log(`🌍 Reverse geocoding: ${latitude}, ${longitude}`);

    if (!GOOGLE_MAPS_API_KEY) {
        console.error('❌ Google Maps API key is not configured');
        return null;
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
    console.log('📡 Geocoding URL:', url.replace(GOOGLE_MAPS_API_KEY, 'API_KEY_HIDDEN'));

    try {
        const response = await fetch(url);
        const data = await response.json();

        console.log('📥 Geocoding response status:', data.status);

        if (data.status === 'REQUEST_DENIED') {
            console.error('❌ Geocoding request denied:', data.error_message);
            return null;
        }

        if (data.status === 'OK' && data.results && data.results.length > 0) {
            const result: GeocodingResult = data.results[0];
            const components = result.address_components;

            // Extract street name (route)
            const street = components.find((c) => c.types.includes('route'))?.long_name;

            // Extract city (locality or administrative_area_level_2)
            const city =
                components.find((c) => c.types.includes('locality'))?.long_name ||
                components.find((c) => c.types.includes('administrative_area_level_2'))?.long_name;

            // Extract state (administrative_area_level_1)
            const state = components.find((c) => c.types.includes('administrative_area_level_1'))?.long_name;

            // Extract country
            const country = components.find((c) => c.types.includes('country'))?.long_name;

            // Extract postal code
            const postalCode = components.find((c) => c.types.includes('postal_code'))?.long_name;

            const addressResult = {
                street,
                city,
                state,
                country,
                postalCode,
                formattedAddress: result.formatted_address,
            };

            console.log('✅ Geocoding success:', addressResult);
            return addressResult;
        }

        console.warn(`⚠️ Geocoding failed with status: ${data.status}`);
        return null;
    } catch (error) {
        console.error('❌ Error reverse geocoding:', error);
        return null;
    }
};

/**
 * Get just the street name from coordinates
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Street name or "Street not found"
 */
export const getStreetName = async (
    latitude: number,
    longitude: number
): Promise<string> => {
    const address = await reverseGeocode(latitude, longitude);
    return address?.street || 'Street not found';
};
