import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    Dimensions,
    GestureResponderEvent,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useStylePalette } from '@/constants/StylePalette';
import { SceneformView } from '@sceneview/react-native-sceneform';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import AutoPotholeDetection from './AutoPotholeDetection';

const { width, height } = Dimensions.get('window');

type DepthMeasurementProps = {
    visible: boolean;
    onClose: () => void;
    onMeasurementComplete: (depth: number, width?: number) => void;
};

type MeasurementMode = 'depth' | 'width' | 'distance';

export default function DepthMeasurement({
    visible,
    onClose,
    onMeasurementComplete,
}: DepthMeasurementProps) {
    const { colors } = useTheme();
    const styles = useStylePalette();
    const sceneformRef = useRef<any>(null);
    const camera = useRef<Camera>(null);
    const device = useCameraDevice('back');

    const [detectionMode, setDetectionMode] = useState<'manual' | 'auto' | 'manual-camera'>('manual');
    const [mode, setMode] = useState<MeasurementMode>('depth');
    const [depth, setDepth] = useState<number | null>(null);
    const [widthValue, setWidthValue] = useState<number | null>(null);

    // Manual camera-based measurement state
    const [clickedPoints, setClickedPoints] = useState<Array<{ x: number, y: number }>>([]);
    const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);
    const [cameraPermission, setCameraPermission] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const cameraViewRef = useRef<View>(null);
    const [cameraViewDimensions, setCameraViewDimensions] = useState({ width: 0, height: 0 });

    // AR distance detection state
    const [arDistanceToGround, setArDistanceToGround] = useState<number | null>(null);
    const [arSessionActive, setArSessionActive] = useState(false);
    const arSessionRef = useRef<any>(null);

    // Refs to avoid stale closures in callbacks
    const sessionReadyRef = useRef(false);
    const modeRef = useRef<MeasurementMode>('depth');
    const referencePointRef = useRef<{ x: number, y: number, z: number } | null>(null);
    const measurementPointRef = useRef<{ x: number, y: number, z: number } | null>(null);

    const [referencePoint, setReferencePoint] = useState<{ x: number, y: number, z: number } | null>(null);
    const [measurementPoint, setMeasurementPoint] = useState<{ x: number, y: number, z: number } | null>(null);

    const [sessionReady, setSessionReady] = useState(false);
    const [initializationTime, setInitializationTime] = useState(0);

    // Sync refs with state
    useEffect(() => {
        sessionReadyRef.current = sessionReady;
    }, [sessionReady]);

    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    // Request camera permission for manual-camera mode
    useEffect(() => {
        if (detectionMode === 'manual-camera') {
            (async () => {
                const status = await Camera.requestCameraPermission();
                setCameraPermission(status === 'granted');
                setCameraActive(status === 'granted');
            })();
        } else {
            setCameraActive(false);
        }
    }, [detectionMode]);

    // Reset states when modal closes
    useEffect(() => {
        if (!visible) {
            setSessionReady(false);
            sessionReadyRef.current = false;
            setDepth(null);
            setWidthValue(null);

            setReferencePoint(null);
            referencePointRef.current = null;

            setMeasurementPoint(null);
            measurementPointRef.current = null;

            setMode('depth');
            modeRef.current = 'depth';

            setInitializationTime(0);
            setClickedPoints([]);
            setMeasuredDistance(null);
            setCameraActive(false);
            setArDistanceToGround(null);
            setArSessionActive(false);
        }
    }, [visible]);

    // Manage camera state when switching modes
    useEffect(() => {
        if (detectionMode === 'manual-camera') {
            // Activate camera for manual-camera mode
            setCameraActive(true);
        } else {
            // Deactivate camera for other modes (AR, auto)
            setCameraActive(false);
            setClickedPoints([]);
            setMeasuredDistance(null);
        }
    }, [detectionMode]);

    // Track initialization time
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

    // Calculate distance using triangle geometry and camera perspective
    const calculateDistance = useCallback((point1: { x: number, y: number }, point2: { x: number, y: number }) => {
        console.log('=== CALCULATE DISTANCE START ===');
        console.log('Point 1:', point1);
        console.log('Point 2:', point2);

        // Calculate pixel distance between two screen coordinates
        const dx = point2.x - point1.x;
        const dy = point2.y - point1.y;
        const pixelDistance = Math.sqrt(dx * dx + dy * dy);
        console.log('dx:', dx, 'dy:', dy, 'pixelDistance:', pixelDistance, 'px');

        // Camera parameters
        const FOV_DEGREES = 67; // Typical mobile camera FOV
        const FOV_RADIANS = (FOV_DEGREES * Math.PI) / 180;

        // Calculate focal length in pixels
        const screenWidth = cameraViewDimensions.width || width;
        console.log('cameraViewDimensions:', cameraViewDimensions, 'screenWidth:', screenWidth);
        const focalLengthPixels = screenWidth / (2 * Math.tan(FOV_RADIANS / 2));
        console.log('focalLengthPixels:', focalLengthPixels);

        // Use AR distance if available, otherwise fallback to estimate
        const distanceToGround = arDistanceToGround || 1.5; // meters (AR or typical phone height)
        console.log('arDistanceToGround:', arDistanceToGround, 'distanceToGround:', distanceToGround);

        // Calculate pixels per meter at that distance
        const pixelsPerMeter = focalLengthPixels / distanceToGround;
        console.log('pixelsPerMeter:', pixelsPerMeter);

        // Convert pixel distance to real-world distance
        const realDistanceMeters = pixelDistance / pixelsPerMeter;
        const realDistanceCm = realDistanceMeters * 100;
        console.log('realDistanceMeters:', realDistanceMeters, 'realDistanceCm:', realDistanceCm);
        console.log('=== CALCULATE DISTANCE END ===');

        return realDistanceCm;
    }, [cameraViewDimensions, arDistanceToGround]);

    // Handle camera view taps for manual measurement
    const handleCameraPress = useCallback((event: GestureResponderEvent) => {
        const { locationX, locationY } = event.nativeEvent;
        const newPoint = { x: locationX, y: locationY };
        console.log('Camera pressed at:', newPoint);

        if (clickedPoints.length === 0) {
            // First point clicked
            console.log('First point set');
            setClickedPoints([newPoint]);
            setMeasuredDistance(null);
        } else if (clickedPoints.length === 1) {
            // Second point clicked - calculate distance
            console.log('Second point set, calculating distance...');
            const distance = calculateDistance(clickedPoints[0], newPoint);
            setClickedPoints([...clickedPoints, newPoint]);
            setMeasuredDistance(distance);

            // Set depth or width based on mode
            if (mode === 'depth') {
                setDepth(distance);
            } else if (mode === 'width') {
                setWidthValue(distance);
            }
        } else {
            // Reset and start new measurement
            console.log('Resetting measurement');
            setClickedPoints([newPoint]);
            setMeasuredDistance(null);
            setDepth(null);
            setWidthValue(null);
        }
    }, [clickedPoints, calculateDistance, mode]);

    // Handle camera view layout to get dimensions
    const handleCameraLayout = useCallback((event: any) => {
        const { width: w, height: h } = event.nativeEvent.layout;
        setCameraViewDimensions({ width: w, height: h });
    }, []);

    const handleSessionCreate = useCallback((event: any) => {
        console.log('AR Session callback triggered!', event);
        console.log('Setting sessionReady to TRUE');
        setSessionReady(true);
        sessionReadyRef.current = true;
        setInitializationTime(0);
    }, []);

    // AR session callback for manual-camera mode (distance detection only)
    const handleArSessionForDistance = useCallback((event: any) => {
        console.log('AR Session for distance detection initialized');
        setArSessionActive(true);
        arSessionRef.current = event;
    }, []);

    // AR plane tap handler for distance detection in manual-camera mode
    const handleArPlaneForDistance = useCallback((event: any) => {
        console.log('AR Plane detected for distance:', event);

        // Extract distance from the hit point
        if (event && event.distance !== undefined) {
            const distance = Math.abs(event.distance);
            console.log('AR Distance to ground:', distance, 'm');
            setArDistanceToGround(distance);
        } else if (event && event.z !== undefined) {
            // Fallback: use z coordinate as distance
            const distance = Math.abs(event.z);
            console.log('AR Distance (from z):', distance, 'm');
            setArDistanceToGround(distance);
        } else if (event && event.pose) {
            // Try to extract from pose data
            const pose = event.pose;
            if (pose.translation && pose.translation.length >= 3) {
                const distance = Math.sqrt(
                    pose.translation[0] * pose.translation[0] +
                    pose.translation[1] * pose.translation[1] +
                    pose.translation[2] * pose.translation[2]
                );
                console.log('AR Distance (from pose):', distance, 'm');
                setArDistanceToGround(distance);
            }
        }
    }, []);

    const handleTapPlane = useCallback((event: any) => {
        const isReady = sessionReadyRef.current;
        console.log('sessionReady state:', isReady);

        if (!isReady) {
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

        const currentRefPoint = referencePointRef.current;
        const currentMeasurePoint = measurementPointRef.current;
        const currentMode = modeRef.current;

        if (!currentRefPoint) {
            // First tap: set reference point
            setReferencePoint(hitPoint);
            referencePointRef.current = hitPoint;

            const instruction = currentMode === 'depth'
                ? 'Now tap the BOTTOM of the pothole'
                : 'Now tap the OTHER EDGE of the pothole';
            Alert.alert('Reference Set', instruction);
        } else if (!currentMeasurePoint) {
            // Second tap: set measurement point and calculate
            setMeasurementPoint(hitPoint);
            measurementPointRef.current = hitPoint;

            if (currentMode === 'depth') {
                // Calculate 3D distance (depth) using real AR coordinates
                const dx = hitPoint.x - currentRefPoint.x;
                const dy = hitPoint.y - currentRefPoint.y;
                const dz = hitPoint.z - currentRefPoint.z;
                const calculatedDepth = Math.sqrt(dx * dx + dy * dy + dz * dz) * 100; // 3D distance in cm
                setDepth(calculatedDepth);
                console.log(`Depth measured: ${calculatedDepth.toFixed(1)} cm (3D distance from AR)`);
                console.log(`Point 1: (${currentRefPoint.x}, ${currentRefPoint.y}, ${currentRefPoint.z})`);
                console.log(`Point 2: (${hitPoint.x}, ${hitPoint.y}, ${hitPoint.z})`);
                Alert.alert('Depth Measured', `${calculatedDepth.toFixed(1)} cm`);
            } else {
                // Calculate 3D distance (width) using real AR coordinates
                const dx = hitPoint.x - currentRefPoint.x;
                const dy = hitPoint.y - currentRefPoint.y;
                const dz = hitPoint.z - currentRefPoint.z;
                const calculatedWidth = Math.sqrt(dx * dx + dy * dy + dz * dz) * 100; // 3D distance in cm
                setWidthValue(calculatedWidth);
                console.log(`Width measured: ${calculatedWidth.toFixed(1)} cm (3D distance from AR)`);
                console.log(`Point 1: (${currentRefPoint.x}, ${currentRefPoint.y}, ${currentRefPoint.z})`);
                console.log(`Point 2: (${hitPoint.x}, ${hitPoint.y}, ${hitPoint.z})`);
                Alert.alert('Width Measured', `${calculatedWidth.toFixed(1)} cm`);
            }

            // Reset for next measurement
            setTimeout(() => {
                setReferencePoint(null);
                referencePointRef.current = null;
                setMeasurementPoint(null);
                measurementPointRef.current = null;
            }, 500);
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
        sessionReadyRef.current = false;
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



    // If auto-detection mode is selected, show AutoPotholeDetection component
    if (detectionMode === 'auto') {
        return (
            <AutoPotholeDetection
                visible={visible}
                onClose={onClose}
                onMeasurementComplete={onMeasurementComplete}
            />
        );
    }

    // If manual-camera mode is selected, show camera with click-to-measure
    if (detectionMode === 'manual-camera') {
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
                        <TouchableOpacity
                            onPress={() => setDetectionMode('manual')}
                            style={[cstyles.modeToggleButton, { borderColor: colors.mediaAddButton }]}
                        >
                            <Text style={[styles.buttonText, { fontSize: 14 }]}>
                                AR Mode
                            </Text>
                        </TouchableOpacity>
                        <Text style={[styles.title, { fontSize: 20 }]}>
                            📏 Manual Measure
                        </Text>
                        <TouchableOpacity onPress={handleCancel} style={cstyles.closeButton}>
                            <Text style={[styles.buttonText, { fontSize: 24 }]}>×</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Camera View */}
                    <View style={cstyles.sceneContainer} onLayout={handleCameraLayout}>
                        {device && cameraPermission ? (
                            <TouchableOpacity
                                activeOpacity={1}
                                onPress={handleCameraPress}
                                style={{ flex: 1 }}
                            >
                                <Camera
                                    ref={camera}
                                    style={StyleSheet.absoluteFill}
                                    device={device}
                                    isActive={cameraActive && visible}
                                    photo={false}
                                />

                                {/* Point markers */}
                                {clickedPoints.map((point, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            cstyles.pointMarker,
                                            {
                                                left: point.x - 10,
                                                top: point.y - 10,
                                                backgroundColor: index === 0 ? '#00ff00' : '#00aaff',
                                            },
                                        ]}
                                    >
                                        <Text style={cstyles.pointLabel}>{index + 1}</Text>
                                    </View>
                                ))}

                                {/* Distance line */}
                                {clickedPoints.length === 2 && (
                                    <View
                                        style={[
                                            cstyles.distanceLine,
                                            {
                                                left: clickedPoints[0].x,
                                                top: clickedPoints[0].y,
                                                width: Math.sqrt(
                                                    Math.pow(clickedPoints[1].x - clickedPoints[0].x, 2) +
                                                    Math.pow(clickedPoints[1].y - clickedPoints[0].y, 2)
                                                ),
                                                transform: [
                                                    {
                                                        rotate: `${Math.atan2(
                                                            clickedPoints[1].y - clickedPoints[0].y,
                                                            clickedPoints[1].x - clickedPoints[0].x
                                                        )}rad`,
                                                    },
                                                ],
                                            },
                                        ]}
                                    />
                                )}

                                {/* Live distance display */}
                                {measuredDistance !== null && clickedPoints.length === 2 && (
                                    <View
                                        style={[
                                            cstyles.distanceLabel,
                                            {
                                                left: (clickedPoints[0].x + clickedPoints[1].x) / 2 - 50,
                                                top: (clickedPoints[0].y + clickedPoints[1].y) / 2 - 20,
                                            },
                                        ]}
                                    >
                                        <Text style={cstyles.distanceLabelText}>
                                            {measuredDistance.toFixed(1)} cm
                                        </Text>
                                    </View>
                                )}

                                {/* Crosshair */}
                                <View style={cstyles.crosshair}>
                                    <View style={[cstyles.crosshairHorizontal, { backgroundColor: '#00aaff' }]} />
                                    <View style={[cstyles.crosshairVertical, { backgroundColor: '#00aaff' }]} />
                                </View>

                                {/* Invisible AR overlay for distance detection */}
                                <View style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}>
                                    <SceneformView
                                        displayPlanes={false}
                                        onSessionCreate={handleArSessionForDistance}
                                        onTapPlane={handleArPlaneForDistance}
                                        style={{ width: 1, height: 1 }}
                                    />
                                </View>

                                {/* Distance indicator */}
                                <View style={cstyles.distanceIndicator}>
                                    <Text style={cstyles.distanceIndicatorText}>
                                        📏 {arDistanceToGround
                                            ? `${arDistanceToGround.toFixed(2)}m (AR)`
                                            : '1.5m (estimated)'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={cstyles.overlay}>
                                <Text style={[styles.subtitle, { color: '#fff', textAlign: 'center', fontSize: 18 }]}>
                                    {!cameraPermission ? '📷 Camera Permission Required' : '📷 Camera Loading...'}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Instructions */}
                    <View style={cstyles.instructions}>
                        <Text style={[styles.subtitle, { textAlign: 'center', marginBottom: 10, fontSize: 16 }]}>
                            {clickedPoints.length === 0
                                ? '📍 Tap FIRST point on screen'
                                : clickedPoints.length === 1
                                    ? '📍 Tap SECOND point on screen'
                                    : measuredDistance !== null
                                        ? `✅ Distance: ${measuredDistance.toFixed(1)} cm`
                                        : 'Calculating...'}
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
                            onPress={() => {
                                setClickedPoints([]);
                                setMeasuredDistance(null);
                                setDepth(null);
                                setWidthValue(null);
                            }}
                        >
                            <Text style={[styles.buttonText, { fontSize: 16 }]}>
                                Reset
                            </Text>
                        </TouchableOpacity>

                        {measuredDistance !== null && (
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
                    <TouchableOpacity
                        onPress={() => {
                            if (detectionMode === 'manual') {
                                setDetectionMode('manual-camera');
                            } else if (detectionMode === 'manual-camera') {
                                setDetectionMode('auto');
                            } else {
                                setDetectionMode('manual');
                            }
                        }}
                        style={[cstyles.modeToggleButton, { borderColor: colors.mediaAddButton }]}
                    >
                        <Text style={[styles.buttonText, { fontSize: 14 }]}>
                            {detectionMode === 'manual' ? '📍 AR Mode' : detectionMode === 'manual-camera' ? '📏 Screen Tap' : '🤖 Auto'}
                        </Text>
                    </TouchableOpacity>
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
    pointMarker: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pointLabel: {
        color: '#000',
        fontSize: 12,
        fontWeight: 'bold',
    },
    distanceLine: {
        position: 'absolute',
        height: 3,
        backgroundColor: '#ffaa00',
    },
    distanceLabel: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 170, 255, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        width: 100,
        alignItems: 'center',
    },
    distanceLabelText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    distanceIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    distanceIndicatorText: {
        color: '#00ff00',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
