import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { MediaItem } from '@/lib/types';
import { useTheme } from '@/hooks/useTheme';

interface MediaPickerProps {
    mediaList: MediaItem[];
    onPickMedia: () => void;
    onCaptureMedia: () => void;
}

export default function MediaPicker({ mediaList, onPickMedia, onCaptureMedia }: MediaPickerProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.buttonLoginBg }]} onPress={onPickMedia}>
                    <Text style={styles.buttonText}>📁 Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, { backgroundColor: colors.buttonCreateBg }]} onPress={onCaptureMedia}>
                    <Text style={styles.buttonText}>📸 Camera</Text>
                </TouchableOpacity>
            </View>

            {mediaList.length > 0 && (
                <ScrollView horizontal style={styles.previewScroll} showsHorizontalScrollIndicator={false}>
                    {mediaList.map((item) => (
                        <View key={item.id} style={styles.previewItem}>
                            <Image source={{ uri: item.uri }} style={styles.previewImage} />
                            {item.type === 'video' && (
                                <View style={styles.videoOverlay}>
                                    <Text style={styles.videoIcon}>▶️</Text>
                                </View>
                            )}
                        </View>
                    ))}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        width: '100%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 15,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    previewScroll: {
        marginTop: 10,
    },
    previewItem: {
        marginRight: 10,
        position: 'relative',
    },
    previewImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    videoOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    videoIcon: {
        fontSize: 24,
    },
});
