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
import AutoPotholeDetection from './AutoPotholeDetection';

const { width, height } = Dimensions.get('window');

type DepthMeasurementProps = {
    visible: boolean;
    onClose: () => void;
    onMeasurementComplete: (depth: number, width?: number, area?: number, aiDescription?: string) => void;
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

    const [detectionMode, setDetectionMode] = useState<'manual' | 'auto'>('manual');
    const [mode, setMode] = useState<MeasurementMode>('depth');
    const [depth, setDepth] = useState<number | null>(null);
    const [widthValue, setWidthValue] = useState<number | null>(null);
    const [sessionReady, setSessionReady] = useState(false);
    const [initializationTime, setInitializationTime] = useState(0);

    const [referencePoint, setReferencePoint] = useState<{ x: number, y: number, z: number } | null>(null);
    const [measurementPoint, setMeasurementPoint] = useState<{ x: number, y: number, z: number } | null>(null);

    const sessionReadyRef = useRef(false);
    const modeRef = useRef<MeasurementMode>('depth');
    const referencePointRef = useRef<{ x: number, y: number, z: number } | null>(null);
    const measurementPointRef = useRef<{ x: number, y: number, z: number } | null>(null);

    useEffect(() => {
        sessionReadyRef.current = sessionReady;
    }, [sessionReady]);

    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval> | undefined;
        if (visible && !sessionReady && detectionMode === 'manual') {
            interval = setInterval(() => {
                setInitializationTime(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [visible, sessionReady, detectionMode]);

    const handleSessionCreate = useCallback((event: any) => {
        console.log('AR Session callback triggered!', event);
        console.log('Setting sessionReady to TRUE');
        setSessionReady(true);
        sessionReadyRef.current = true;
        setInitializationTime(0);
    }, []);

    const handleTapPlane = useCallback((event: any) => {
        const isReady = sessionReadyRef.current;
        console.log('sessionReady state:', isReady);

        if (!isReady) {
            Alert.alert('Not Ready', 'AR session is still initializing. Please wait...');
            return;
        }

        console.log('Plane tapped event keys:', Object.keys(event));

        let hitPoint = { x: 0, y: 0, z: 0 };

        if (event.hitTestResult && event.hitTestResult.worldTransform) {
            const transform = event.hitTestResult.worldTransform;
            hitPoint = { x: transform[12], y: transform[13], z: transform[14] };
        } else if (event.hitResult && event.hitResult.worldPosition) {
            const pos = event.hitResult.worldPosition;
            hitPoint = { x: pos.x, y: pos.y, z: pos.z };
        } else if (event.x !== undefined && event.z !== undefined) {
            hitPoint = { x: event.x, y: event.y, z: event.z };
        }

        console.log('Resolved 3D Hit Point:', hitPoint);

        const currentRefPoint = referencePointRef.current;
        const currentMeasurePoint = measurementPointRef.current;
        const currentMode = modeRef.current;

        if (!currentRefPoint) {
            setReferencePoint(hitPoint);
            referencePointRef.current = hitPoint;
            const instruction = currentMode === 'depth'
                ? 'Now tap the BOTTOM of the pothole'
                : 'Now tap the OTHER EDGE of the pothole';
            Alert.alert('Reference Set', instruction);
        } else if (!currentMeasurePoint) {
            setMeasurementPoint(hitPoint);
            measurementPointRef.current = hitPoint;

            if (currentMode === 'depth') {
                const dx = hitPoint.x - currentRefPoint.x;
                const dy = hitPoint.y - currentRefPoint.y;
                const dz = hitPoint.z - currentRefPoint.z;
                const calculatedDepth = Math.sqrt(dx * dx + dy * dy + dz * dz) * 100;

                console.log(`Depth calculated from AR 3D: ${calculatedDepth}`);
                setDepth(calculatedDepth);
                Alert.alert('Depth Measured', `${calculatedDepth.toFixed(1)} cm`);
            } else {
                const dx = hitPoint.x - currentRefPoint.x;
                const dy = hitPoint.y - currentRefPoint.y;
                const dz = hitPoint.z - currentRefPoint.z;
                const calculatedWidth = Math.sqrt(dx * dx + dy * dy + dz * dz) * 100;

                setWidthValue(calculatedWidth);
                Alert.alert('Width Measured', `${calculatedWidth.toFixed(1)} cm`);
            }
        }
    }, []);

    const handleReset = useCallback(() => {
        setDepth(null);
        setWidthValue(null);
        setReferencePoint(null);
        referencePointRef.current = null;
        setMeasurementPoint(null);
        measurementPointRef.current = null;
    }, []);

    const handleSave = useCallback(() => {
        const measuredDepth = depth || 0;
        const measuredWidth = widthValue || 0;

        if (measuredDepth > 0 || measuredWidth > 0) {
            const diameter = measuredWidth > 0 ? measuredWidth : measuredDepth;
            const radius = diameter / 2;
            const areaCm2 = Math.PI * radius * radius;
            const circleAreaM2 = areaCm2 / 10000;

            onMeasurementComplete(measuredDepth, measuredWidth || undefined, circleAreaM2, undefined);
            handleReset();
            onClose();
        } else {
            Alert.alert('No Measurements', 'Please calculate a distance or use AI detect first.');
        }
    }, [depth, widthValue, onMeasurementComplete, onClose, handleReset]);

    const handleCancel = useCallback(() => {
        handleReset();
        setSessionReady(false);
        sessionReadyRef.current = false;
        onClose();
    }, [onClose, handleReset]);

    if (detectionMode === 'auto') {
        return (
            <AutoPotholeDetection
                visible={visible}
                onClose={onClose}
                onMeasurementComplete={onMeasurementComplete}
            />
        );
    }

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
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity
                            onPress={() => setDetectionMode('auto')}
                            style={[cstyles.modeToggleButton, { borderColor: colors.mediaAddButton }]}
                        >
                            <Text style={[styles.buttonText, { fontSize: 12 }]}>🤖 AI</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Mode Toggle (Depth/Width) */}
                    <View style={{ flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, marginHorizontal: 10 }}>
                        <TouchableOpacity
                            onPress={() => { handleReset(); setMode('depth'); }}
                            style={[
                                cstyles.modeToggleButton,
                                {
                                    backgroundColor: mode === 'depth' ? colors.buttonLoginBg : 'transparent',
                                    borderWidth: 0,
                                    margin: 2
                                }
                            ]}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Depth</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { handleReset(); setMode('width'); }}
                            style={[
                                cstyles.modeToggleButton,
                                {
                                    backgroundColor: mode === 'width' ? colors.buttonLoginBg : 'transparent',
                                    borderWidth: 0,
                                    margin: 2
                                }
                            ]}
                        >
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Width</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={handleCancel} style={cstyles.closeButton}>
                        <Text style={[styles.buttonText, { fontSize: 24 }]}>×</Text>
                    </TouchableOpacity>
                </View>

                {/* AR View */}
                <View style={cstyles.sceneContainer}>
                    <SceneformView
                        style={cstyles.arView}
                        onSessionCreate={handleSessionCreate}
                        onTapPlane={handleTapPlane}
                    />
                    {(!sessionReady) && (
                        <View style={cstyles.overlay}>
                            <Text style={{ color: '#fff', fontSize: 16 }}>Initializing AR...</Text>
                        </View>
                    )}
                    <View style={[cstyles.overlay, { pointerEvents: 'none', justifyContent: 'flex-start', paddingTop: 20 }]}>
                        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 8 }}>
                            {mode === 'depth' ? 'Depth Mode' : 'Width Mode'}
                        </Text>
                    </View>
                </View>

                {/* Instructions */}
                <View style={cstyles.instructions}>
                    <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: 10, fontSize: 16 }]}>
                        {!referencePoint ? 'Tap to set Start Point' : !measurementPoint ? 'Tap to set End Point' : 'Measured!'}
                    </Text>
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
    modeToggleButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 2,
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
        backgroundColor: '#000',
    },
    arView: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructions: {
        padding: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    pointMarker: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'red',
    },
});
