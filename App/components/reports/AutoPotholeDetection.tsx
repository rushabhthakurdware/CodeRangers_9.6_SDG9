import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useStylePalette } from '@/constants/StylePalette';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { DETECTION_CONFIG } from '@/utils/PotholeDetector';
import {
    PotholeMeasurement,
} from '@/utils/ARMeasurementUtils';

const { width } = Dimensions.get('window');

type AutoPotholeDetectionProps = {
    visible: boolean;
    onClose: () => void;
    onMeasurementComplete: (depth: number, width?: number) => void;
};

export default function AutoPotholeDetection({
    visible,
    onClose,
    onMeasurementComplete,
}: AutoPotholeDetectionProps) {
    const { colors } = useTheme();
    const styles = useStylePalette();

    // Camera setup
    const device = useCameraDevice('back');
    const [hasPermission, setHasPermission] = useState(false);
    const [isActive, setIsActive] = useState(false);

    // Detection state
    const [currentMeasurement, setCurrentMeasurement] = useState<PotholeMeasurement | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [autoMeasureEnabled, setAutoMeasureEnabled] = useState(true);
    const [detectionCount, setDetectionCount] = useState(0);

    // Request camera permission
    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // Activate camera when modal is visible
    useEffect(() => {
        setIsActive(visible);
        if (!visible) {
            setCurrentMeasurement(null);
            setIsProcessing(false);
            setDetectionCount(0);
        }
    }, [visible]);

    // Simulate detection every 0.5 seconds
    useEffect(() => {
        if (!isActive || !visible) return;

        const interval = setInterval(() => {
            setIsProcessing(true);
            setDetectionCount(prev => prev + 1);

            // Simulate detection processing
            setTimeout(() => {
                const mockDetected = Math.random() > 0.7;

                if (mockDetected) {
                    const mockWidth = 10 + Math.random() * 30;
                    const mockArea = Math.PI * (mockWidth / 2) * (mockWidth / 2);
                    const mockConfidence = 0.7 + Math.random() * 0.3;

                    const measurement: PotholeMeasurement = {
                        width: mockWidth,
                        depth: 5 + Math.random() * 10,
                        area: mockArea,
                        distance: 1.5,
                        confidence: mockConfidence,
                    };

                    setCurrentMeasurement(measurement);

                    if (autoMeasureEnabled && mockConfidence >= DETECTION_CONFIG.CONFIDENCE_THRESHOLD) {
                        Alert.alert(
                            'Pothole Detected!',
                            `Width: ${mockWidth.toFixed(1)} cm\nArea: ${mockArea.toFixed(0)} cm²\nConfidence: ${(mockConfidence * 100).toFixed(0)}%`,
                            [
                                { text: 'Reject', style: 'cancel', onPress: () => setCurrentMeasurement(null) },
                                {
                                    text: 'Accept',
                                    onPress: () => {
                                        onMeasurementComplete(measurement.depth, measurement.width);
                                        onClose();
                                    },
                                },
                            ]
                        );
                    }
                }

                setIsProcessing(false);
            }, 100);
        }, DETECTION_CONFIG.PROCESSING_INTERVAL);

        return () => clearInterval(interval);
    }, [isActive, visible, autoMeasureEnabled, onMeasurementComplete, onClose]);

    const handleManualCapture = useCallback(() => {
        if (currentMeasurement) {
            onMeasurementComplete(currentMeasurement.depth, currentMeasurement.width);
            onClose();
        } else {
            Alert.alert('No Detection', 'Point camera at a pothole to detect it.');
        }
    }, [currentMeasurement, onMeasurementComplete, onClose]);

    const handleCancel = useCallback(() => {
        onClose();
    }, [onClose]);

    if (!hasPermission) {
        return (
            <Modal visible={visible} transparent={false} onRequestClose={onClose}>
                <View style={[cstyles.container, { backgroundColor: colors.background }]}>
                    <View style={cstyles.permissionContainer}>
                        <Text style={[styles.title, { fontSize: 18, textAlign: 'center' }]}>
                            Camera Permission Required
                        </Text>
                        <Text style={[styles.subtitle, { textAlign: 'center', marginTop: 10 }]}>
                            Please grant camera access to use automatic pothole detection.
                        </Text>
                        <TouchableOpacity
                            style={[styles.simpleButton, { marginTop: 20, backgroundColor: colors.buttonLoginBg }]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    if (!device) {
        return (
            <Modal visible={visible} transparent={false} onRequestClose={onClose}>
                <View style={[cstyles.container, { backgroundColor: colors.background }]}>
                    <View style={cstyles.permissionContainer}>
                        <Text style={[styles.title, { fontSize: 18 }]}>No Camera Available</Text>
                        <TouchableOpacity
                            style={[styles.simpleButton, { marginTop: 20 }]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={handleCancel}>
            <View style={[cstyles.container, { backgroundColor: colors.background }]}>
                <View style={cstyles.header}>
                    <Text style={[styles.title, { fontSize: 20 }]}>🤖 Auto Detect</Text>
                    <TouchableOpacity onPress={handleCancel} style={cstyles.closeButton}>
                        <Text style={[styles.buttonText, { fontSize: 24 }]}>×</Text>
                    </TouchableOpacity>
                </View>

                <View style={cstyles.cameraContainer}>
                    <Camera style={StyleSheet.absoluteFill} device={device} isActive={isActive} />

                    {isProcessing && (
                        <View style={cstyles.processingIndicator}>
                            <ActivityIndicator size="small" color="#00ff00" />
                            <Text style={cstyles.processingText}>Analyzing...</Text>
                        </View>
                    )}

                    {currentMeasurement && (
                        <View style={cstyles.detectionOverlay}>
                            <Text style={cstyles.detectionText}>✓ Pothole Detected</Text>
                        </View>
                    )}

                    <View style={cstyles.crosshair}>
                        <View style={cstyles.crosshairHorizontal} />
                        <View style={cstyles.crosshairVertical} />
                    </View>

                    <View style={cstyles.scanCounter}>
                        <Text style={cstyles.scanCountText}>Scans: {detectionCount}</Text>
                    </View>
                </View>

                <View style={cstyles.statusContainer}>
                    <Text style={[styles.subtitle, { textAlign: 'center', fontSize: 16 }]}>
                        {currentMeasurement
                            ? `✅ Width: ${currentMeasurement.width.toFixed(1)} cm · Area: ${currentMeasurement.area.toFixed(0)} cm²`
                            : '👁️ Scanning for potholes...'}
                    </Text>
                    {currentMeasurement && (
                        <Text style={[styles.subtitle, { textAlign: 'center', fontSize: 12, marginTop: 5, color: colors.subtitle }]}>
                            Confidence: {(currentMeasurement.confidence * 100).toFixed(0)}% · Distance: {currentMeasurement.distance.toFixed(1)}m
                        </Text>
                    )}
                </View>

                <View style={cstyles.toggleContainer}>
                    <Text style={[styles.subtitle, { fontSize: 14 }]}>Auto Measure:</Text>
                    <TouchableOpacity
                        style={[cstyles.toggleButton, autoMeasureEnabled && cstyles.toggleButtonActive, { borderColor: colors.mediaAddButton }]}
                        onPress={() => setAutoMeasureEnabled(!autoMeasureEnabled)}
                    >
                        <Text style={styles.buttonText}>{autoMeasureEnabled ? 'ON' : 'OFF'}</Text>
                    </TouchableOpacity>
                </View>

                <View style={cstyles.controls}>
                    <TouchableOpacity
                        style={[styles.simpleButton, { backgroundColor: colors.mediaAddButton, paddingVertical: 12, width: width * 0.4 }]}
                        onPress={handleCancel}
                    >
                        <Text style={[styles.buttonText, { fontSize: 16 }]}>Cancel</Text>
                    </TouchableOpacity>

                    {currentMeasurement && (
                        <TouchableOpacity
                            style={[styles.simpleButton, { backgroundColor: colors.buttonLoginBg, paddingVertical: 12, width: width * 0.4 }]}
                            onPress={handleManualCapture}
                        >
                            <Text style={[styles.buttonText, { fontSize: 16 }]}>Capture</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const cstyles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 },
    closeButton: { padding: 5 },
    cameraContainer: { flex: 1, margin: 20, borderRadius: 12, overflow: 'hidden', position: 'relative' },
    permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    processingIndicator: { position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 12, borderRadius: 8, flexDirection: 'row', alignItems: 'center', gap: 8 },
    processingText: { color: '#00ff00', fontSize: 12, fontWeight: 'bold' },
    detectionOverlay: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -75 }, { translateY: -25 }], backgroundColor: 'rgba(0, 255, 0, 0.9)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
    detectionText: { color: '#000', fontSize: 16, fontWeight: 'bold' },
    scanCounter: { position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: 8, borderRadius: 8 },
    scanCountText: { color: '#fff', fontSize: 12 },
    crosshair: { position: 'absolute', top: '50%', left: '50%', width: 40, height: 40, marginLeft: -20, marginTop: -20 },
    crosshairHorizontal: { position: 'absolute', top: '50%', left: 0, right: 0, height: 2, backgroundColor: '#00aaff' },
    crosshairVertical: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, backgroundColor: '#00aaff' },
    statusContainer: { padding: 20, alignItems: 'center' },
    toggleContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, paddingHorizontal: 20, marginBottom: 10 },
    toggleButton: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 8, borderWidth: 2, minWidth: 60, alignItems: 'center' },
    toggleButtonActive: { backgroundColor: 'rgba(0, 255, 0, 0.2)' },
    controls: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, paddingBottom: 40 },
});
