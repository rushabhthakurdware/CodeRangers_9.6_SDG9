import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    Modal,
    Image,
} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useTheme } from '@/hooks/useTheme';
import { useStylePalette } from '@/constants/StylePalette';
import { Ionicons } from '@expo/vector-icons';

interface Detection {
    class: string;
    confidence: number;
    bbox: { x: number; y: number; width: number; height: number };
}

interface PotholeDetectionProps {
    visible: boolean;
    onClose: () => void;
    onDetection: (imageUri: string, detectedClass: string) => void;
}

export default function PotholeDetection({
    visible,
    onClose,
    onDetection,
}: PotholeDetectionProps) {
    const { colors } = useTheme();
    const styles = useStylePalette();

    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isDetecting, setIsDetecting] = useState(false);
    const [detections, setDetections] = useState<Detection[]>([]);
    const [modelLoaded, setModelLoaded] = useState(false);
    const cameraRef = useRef<Camera>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        if (visible) {
            // Simulate model loading
            setTimeout(() => {
                setModelLoaded(true);
                console.log('✅ YOLO model loaded (simulated)');
            }, 1000);
        }
    }, [visible]);

    const detectPothole = async () => {
        if (!cameraRef.current || !modelLoaded) {
            Alert.alert('Not Ready', 'Model is still loading...');
            return;
        }

        setIsDetecting(true);

        try {
            // Capture image
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                base64: false,
            });

            console.log('📸 Image captured for detection');

            // TODO: Run TFLite inference here
            // For now, simulate detection with 80% chance of finding pothole
            const mockDetection = Math.random() > 0.2;

            if (mockDetection) {
                const detection: Detection = {
                    class: 'pothole',
                    confidence: 0.75 + Math.random() * 0.2,
                    bbox: { x: 100, y: 100, width: 200, height: 150 }
                };

                setDetections([detection]);

                Alert.alert(
                    '🎯 Pothole Detected!',
                    `Confidence: ${(detection.confidence * 100).toFixed(1)}%\n\nDo you want to use this detection?`,
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                            onPress: () => {
                                setDetections([]);
                                setIsDetecting(false);
                            }
                        },
                        {
                            text: 'Use Detection',
                            onPress: () => {
                                onDetection(photo.uri, 'Pothole');
                                setDetections([]);
                                setIsDetecting(false);
                                onClose();
                            }
                        }
                    ]
                );
            } else {
                Alert.alert(
                    'No Pothole Detected',
                    'Please try again with a clearer view of the pothole.',
                    [{ text: 'OK', onPress: () => setIsDetecting(false) }]
                );
            }
        } catch (error) {
            console.error('Detection error:', error);
            Alert.alert('Error', 'Failed to detect pothole. Please try again.');
            setIsDetecting(false);
        }
    };

    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return (
            <Modal visible={visible} animationType="slide">
                <View style={cstyles.container}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        Camera permission required
                    </Text>
                    <TouchableOpacity style={styles.simpleButton} onPress={onClose}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide">
            <View style={cstyles.container}>
                {/* Header */}
                <View style={cstyles.header}>
                    <Text style={[styles.title, { color: '#fff' }]}>
                        🔍 Detect Pothole
                    </Text>
                    <TouchableOpacity onPress={onClose} style={cstyles.closeButton}>
                        <Ionicons name="close" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Camera View */}
                <View style={cstyles.cameraContainer}>
                    <Camera
                        ref={cameraRef}
                        style={cstyles.camera}
                        type={CameraType.back}
                    >
                        {/* Model Status Overlay */}
                        {!modelLoaded && (
                            <View style={cstyles.overlay}>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={cstyles.overlayText}>Loading YOLO model...</Text>
                            </View>
                        )}

                        {/* Detection Overlay */}
                        {detections.length > 0 && (
                            <View style={cstyles.detectionOverlay}>
                                {detections.map((det, idx) => (
                                    <View
                                        key={idx}
                                        style={[
                                            cstyles.boundingBox,
                                            {
                                                left: det.bbox.x,
                                                top: det.bbox.y,
                                                width: det.bbox.width,
                                                height: det.bbox.height,
                                            }
                                        ]}
                                    >
                                        <Text style={cstyles.detectionLabel}>
                                            {det.class} {(det.confidence * 100).toFixed(0)}%
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Instructions */}
                        {modelLoaded && !isDetecting && (
                            <View style={cstyles.instructionsContainer}>
                                <Text style={cstyles.instructions}>
                                    📐 Point camera at pothole
                                </Text>
                                <Text style={cstyles.instructions}>
                                    Tap detect button when ready
                                </Text>
                            </View>
                        )}
                    </Camera>
                </View>

                {/* Controls */}
                <View style={cstyles.controls}>
                    <TouchableOpacity
                        style={[
                            styles.simpleButton,
                            {
                                backgroundColor: modelLoaded ? colors.primary : '#666',
                                paddingVertical: 16,
                                opacity: isDetecting ? 0.6 : 1,
                            }
                        ]}
                        onPress={detectPothole}
                        disabled={!modelLoaded || isDetecting}
                    >
                        {isDetecting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={[styles.buttonText, { fontSize: 18 }]}>
                                🔍 Detect Pothole
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const cstyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    closeButton: {
        padding: 5,
    },
    cameraContainer: {
        flex: 1,
        margin: 20,
        borderRadius: 12,
        overflow: 'hidden',
    },
    camera: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    overlayText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
    instructionsContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    instructions: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 8,
        marginVertical: 4,
    },
    detectionOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    boundingBox: {
        position: 'absolute',
        borderWidth: 3,
        borderColor: '#00ff00',
        borderRadius: 4,
    },
    detectionLabel: {
        position: 'absolute',
        top: -25,
        left: 0,
        backgroundColor: '#00ff00',
        color: '#000',
        padding: 4,
        borderRadius: 4,
        fontSize: 14,
        fontWeight: 'bold',
    },
    controls: {
        padding: 20,
        paddingBottom: 40,
    },
});
