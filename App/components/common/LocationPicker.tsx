import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useStylePalette } from '@/constants/StylePalette';

interface LocationPickerProps {
    location: { latitude: number; longitude: number; address?: string } | null;
    loading: boolean;
    onFetchLocation: () => void;
}

export default function LocationPicker({ location, loading, onFetchLocation }: LocationPickerProps) {
    const { colors } = useTheme();
    const stylesGen = useStylePalette();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[stylesGen.simpleButton, { backgroundColor: colors.buttonCreateBg }]}
                onPress={onFetchLocation}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={stylesGen.buttonText}>📍 {location ? 'Update Location' : 'Get My Location'}</Text>
                )}
            </TouchableOpacity>

            {location && (
                <View style={styles.locationInfo}>
                    <Text style={[stylesGen.subtitle2, { color: colors.text }]}>
                        Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
                    </Text>
                    {location.address && (
                        <Text style={[stylesGen.subtitle2, { color: colors.text }]} numberOfLines={1}>
                            {location.address}
                        </Text>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        alignItems: 'center',
        width: '100%',
    },
    locationInfo: {
        marginTop: 5,
        alignItems: 'center',
    },
});
