import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    Dimensions,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useStylePalette } from '@/constants/StylePalette';
import { SceneformView } from '@sceneview/react-native-sceneform';

const { width, height } = Dimensions.get('window');

type DepthMeasurementProps = {
    visible: boolean;
    onClose: () => void;
    onMeasurementComplete: (depth: number, width?: number) => void;
};

type MeasurementMode = 'depth' | 'width';

export default function DepthMeasurement({
    visible,
    onClose,
    onMeasurementComplete,
}: DepthMeasurementProps) {
    const { colors } = useTheme();
    const styles = useStylePalette();
    const sceneformRef = useRef<any>(null);

    const [mode, setMode] = useState<MeasurementMode>('depth');
    const [depth, setDepth] = useState<number | null>(null);
    const [widthValue, setWidthValue] = useState<number | null>(null);

    const [referencePoint, setReferencePoint] = useState<{ x: number, y: number, z: number } | null>(null);
    const [measurementPoint, setMeasurementPoint] = useState<{ x: number, y: number, z: number } | null>(null);
    const [sessionReady, setSessionReady] = useState(false);
    const [initializationTime, setInitializationTime] = useState(0);

    // Reset states when modal closes
    useEffect(() => {
        if (!visible) {
            setSessionReady(false);
            setDepth(null);
            setWidthValue(null);
            setReferencePoint(null);
            setMeasurementPoint(null);
            setMode('depth');
            setInitializationTime(0);
        }
    }, [visible]);

    // Track initialization time
    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (visible && !sessionReady) {
            interval = setInterval(() => {
                setInitializationTime(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [visible, sessionReady]);

    const handleSessionCreate = useCallback((event: any) => {
        console.log('AR Session callback triggered!', event);
        console.log('Setting sessionReady to TRUE');
        setSessionReady(true);
        setInitializationTime(0);
    }, []);

    const calculate3DDistance = (p1: { x: number, y: number, z: number }, p2: { x: number, y: number, z: number }) => {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const dz = p2.z - p1.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz) * 100; // Convert to cm
    };

    const handleTapPlane = useCallback((event: any) => {
        console.log('sessionReady state:', sessionReady);

        if (!sessionReady) {
            Alert.alert('Not Ready', 'AR session is still initializing. Please wait...');
            return;
        }

        console.log('Plane tapped:', event);

        // Get the hit point coordinates from the event
        const hitPoint = {
            x: event.x !== undefined ? event.x : 0,
            y: event.y !== undefined ? event.y : 0,
            z: event.z !== undefined ? event.z : 0,
        };

        console.log('Hit point:', hitPoint);

        if (!referencePoint) {
            // First tap: set reference point
            setReferencePoint(hitPoint);
            const instruction = mode === 'depth'
                ? 'Now tap the BOTTOM of the pothole'
                : 'Now tap the OTHER EDGE of the pothole';
            Alert.alert('Reference Set', instruction);
        } else if (!measurementPoint) {
            // Second tap: set measurement point and calculate
            setMeasurementPoint(hitPoint);

            if (mode === 'depth') {
                // Calculate vertical distance (depth)
                const calculatedDepth = Math.abs(referencePoint.y - hitPoint.y) * 100; // Convert to cm
                setDepth(calculatedDepth);
                console.log(`Depth measured: ${calculatedDepth.toFixed(1)} cm`);
                Alert.alert('Depth Measured', `${calculatedDepth.toFixed(1)} cm`);
            } else {
                // Calculate horizontal distance (width)
                const dx = referencePoint.x - hitPoint.x;
                const dz = referencePoint.z - hitPoint.z;
                const calculatedWidth = Math.sqrt(dx * dx + dz * dz) * 100; // Horizontal distance in cm
                setWidthValue(calculatedWidth);
                console.log(`Width measured: ${calculatedWidth.toFixed(1)} cm`);
                Alert.alert('Width Measured', `${calculatedWidth.toFixed(1)} cm`);
            }

            // Reset for next measurement
            setTimeout(() => {
                setReferencePoint(null);
                setMeasurementPoint(null);
            }, 500);
        }
    }, [referencePoint, measurementPoint, sessionReady, mode]);

    const handleReset = useCallback(() => {
        setDepth(null);
        setWidthValue(null);
        setReferencePoint(null);
        setMeasurementPoint(null);
    }, []);

    const toggleMode = useCallback(() => {
        handleReset();
        setMode(prev => prev === 'depth' ? 'width' : 'depth');
    }, [handleReset]);

    const handleSave = useCallback(() => {
        if (depth !== null || widthValue !== null) {
            onMeasurementComplete(depth || 0, widthValue || undefined);
            handleReset();
            onClose();
        }
    }, [depth, widthValue, onMeasurementComplete, onClose, handleReset]);

    const handleCancel = useCallback(() => {
        handleReset();
        setSessionReady(false);
        onClose();
    }, [onClose, handleReset]);

    const getMeasurementInstruction = () => {
        if (!sessionReady) {
            return `Initializing AR... (${initializationTime}s)`;
        }
        if (!referencePoint) {
            return mode === 'depth'
                ? '1️⃣ Tap the TOP edge of pothole'
                : '1️⃣ Tap ONE EDGE of pothole';
        }
        if (!measurementPoint) {
            return mode === 'depth'
                ? '2️⃣ Tap the BOTTOM of pothole'
                : '2️⃣ Tap the OTHER EDGE of pothole';
        }
        if (mode === 'depth' && depth !== null) {
            return `✅ Depth: ${depth.toFixed(1)} cm`;
        }
        if (mode === 'width' && widthValue !== null) {
            return `✅ Width: ${widthValue.toFixed(1)} cm`;
        }
        return 'Calculating...';
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={handleCancel}
        >
            <View style={[cstyles.container, { backgroundColor: colors.background }]}>
                {/* Header */}
                <View style={cstyles.header}>
                    <Text style={[styles.title, { fontSize: 20 }]}>
                        Measure {mode === 'depth' ? 'Depth' : 'Width'}
                    </Text>
                    <TouchableOpacity onPress={handleCancel} style={cstyles.closeButton}>
                        <Text style={[styles.buttonText, { fontSize: 24 }]}>×</Text>
                    </TouchableOpacity>
                </View>

                {/* AR Camera View */}
                <View style={cstyles.sceneContainer}>
                    <SceneformView
                        displayPlanes={true}
                        onSessionCreate={handleSessionCreate}
                        onTapPlane={handleTapPlane}
                        style={{
                            flex: 1,
                            width: '100%',
                            height: '100%',
                        }}
                    />

                    {/* Initialization Overlay - Temporarily disabled for debugging */}
                    {/* {!sessionReady && (
                        <View style={cstyles.overlay}>
                            <Text style={[styles.subtitle, { color: '#fff', textAlign: 'center', fontSize: 18 }]}>
                                📐 Initializing AR...
                            </Text>
                            <Text style={[styles.subtitle, { color: '#ccc', textAlign: 'center', marginTop: 10, fontSize: 14 }]}>
                                Point camera at the ground and move slowly
                            </Text>
                            <Text style={[styles.subtitle, { color: '#888', textAlign: 'center', marginTop: 10, fontSize: 12 }]}>
                                {initializationTime}s elapsed
                            </Text>
                        </View>
                    )} */}

                    {/* Crosshair for aiming */}
                    {sessionReady && (
                        <View style={cstyles.crosshair}>
                            <View style={[cstyles.crosshairHorizontal, { backgroundColor: mode === 'depth' ? '#00ff00' : '#00aaff' }]} />
                            <View style={[cstyles.crosshairVertical, { backgroundColor: mode === 'depth' ? '#00ff00' : '#00aaff' }]} />
                        </View>
                    )}
                </View>

                {/* Instructions */}
                <View style={cstyles.instructions}>
                    <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: 10, fontSize: 16 }]}>
                        {getMeasurementInstruction()}
                    </Text>
                </View>

                {/* Mode Toggle */}
                <View style={cstyles.modeToggle}>
                    <TouchableOpacity
                        style={[
                            cstyles.modeButton,
                            mode === 'depth' && cstyles.modeButtonActive,
                            { borderColor: colors.mediaAddButton },
                        ]}
                        onPress={() => {
                            if (mode !== 'depth') toggleMode();
                        }}
                    >
                        <Text style={[styles.buttonText, { fontSize: 14, color: mode === 'depth' ? colors.buttonText : colors.text }]}>
                            📏 Depth
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            cstyles.modeButton,
                            mode === 'width' && cstyles.modeButtonActive,
                            { borderColor: colors.mediaAddButton },
                        ]}
                        onPress={() => {
                            if (mode !== 'width') toggleMode();
                        }}
                    >
                        <Text style={[styles.buttonText, { fontSize: 14, color: mode === 'width' ? colors.buttonText : colors.text }]}>
                            ↔️ Width
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Controls */}
                <View style={cstyles.controls}>
                    <TouchableOpacity
                        style={[
                            styles.simpleButton,
                            {
                                backgroundColor: colors.mediaAddButton,
                                paddingVertical: 12,
                                width: width * 0.4,
                            },
                        ]}
                        onPress={handleReset}
                        disabled={!sessionReady}
                    >
                        <Text style={[styles.buttonText, { fontSize: 16 }]}>
                            Reset
                        </Text>
                    </TouchableOpacity>

                    {(depth !== null || widthValue !== null) && (
                        <TouchableOpacity
                            style={[
                                styles.simpleButton,
                                {
                                    backgroundColor: colors.buttonLoginBg,
                                    paddingVertical: 12,
                                    width: width * 0.4,
                                },
                            ]}
                            onPress={handleSave}
                        >
                            <Text style={[styles.buttonText, { fontSize: 16 }]}>Save</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const cstyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    closeButton: {
        padding: 5,
    },
    sceneContainer: {
        flex: 1,
        margin: 20,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    arView: {
        ...StyleSheet.absoluteFillObject,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    crosshair: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 40,
        height: 40,
        marginLeft: -20,
        marginTop: -20,
    },
    crosshairHorizontal: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 2,
    },
    crosshairVertical: {
        position: 'absolute',
        left: '50%',
        top: 0,
        bottom: 0,
        width: 2,
    },
    instructions: {
        padding: 20,
        alignItems: 'center',
    },
    modeToggle: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    modeButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 2,
    },
    modeButtonActive: {
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
});
