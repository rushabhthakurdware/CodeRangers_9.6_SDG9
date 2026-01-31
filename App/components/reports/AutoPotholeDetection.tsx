import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Modal,
    Dimensions,
    ActivityIndicator,
    Image,
    TextInput
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { useStylePalette } from '@/constants/StylePalette';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { analyzeImageWithGemini } from '@/lib/services/geminiAIDetection';

const { width, height } = Dimensions.get('window');

type AutoPotholeDetectionProps = {
    visible: boolean;
    onClose: () => void;
    onMeasurementComplete: (depth: number, width?: number, area?: number) => void;
};

// Workflow States
type AIWorkflowState = 'camera' | 'preview' | 'analyzing' | 'results';

export default function AutoPotholeDetection({
    visible,
    onClose,
    onMeasurementComplete,
}: AutoPotholeDetectionProps) {
    const { colors } = useTheme();
    const styles = useStylePalette();
    const device = useCameraDevice('back');
    const camera = useRef<Camera>(null);

    // State
    const [workflowState, setWorkflowState] = useState<AIWorkflowState>('camera');
    const [capturedPhotoPath, setCapturedPhotoPath] = useState<string | null>(null);
    const [hasPermission, setHasPermission] = useState(false);

    // Results
    const [depth, setDepth] = useState<string>('');
    const [pwidth, setPWidth] = useState<string>('');
    const [area, setArea] = useState<string>('');
    const [severity, setSeverity] = useState<string>(''); // Added Severity State
    const [confidence, setConfidence] = useState<number>(0);

    // Initial Permission Check
    useEffect(() => {
        (async () => {
            const status = await Camera.requestCameraPermission();
            setHasPermission(status === 'granted');
            if (status === 'denied') {
                Alert.alert(
                    'Permission Required',
                    'Camera access is needed to capture photos. Please enable it in system settings.',
                    [{ text: 'OK' }]
                );
            }
        })();
    }, []);

    // Reset when modal opens
    useEffect(() => {
        if (visible) {
            setWorkflowState('camera');
            setCapturedPhotoPath(null);
            setDepth('');
            setPWidth('');
            setArea('');
            setSeverity('');
        }
    }, [visible]);

    // 1. Capture Photo
    const handleCapture = async () => {
        if (camera.current) {
            try {
                const photo = await camera.current.takePhoto({
                    flash: 'off',
                    qualityPrioritization: 'quality' // High quality for AI
                });
                setCapturedPhotoPath(`file://${photo.path}`);
                setWorkflowState('preview');
            } catch (e) {
                Alert.alert('Error', 'Failed to capture photo');
            }
        }
    };

    // 2. Upload & Analyze
    const handleAnalyze = async () => {
        if (!capturedPhotoPath) return;

        setWorkflowState('analyzing');
        try {
            const result = await analyzeImageWithGemini(capturedPhotoPath);

            if (result) {
                setDepth(result.depth?.toString() || (result.height?.toString() || '0'));
                setPWidth(result.width?.toString() || '0');
                setArea(result.area?.toString() || '0');
                setSeverity('Moderate'); // Default or inferred from Gemini
                setConfidence(result.confidence || 0);
                setWorkflowState('results');
            } else {
                Alert.alert('Analysis Failed', 'Could not detect pothole details. Try a clearer angle.');
                setWorkflowState('preview');
            }
        } catch (e: any) {
            Alert.alert('Error', e.message);
            setWorkflowState('preview');
        }
    };

    // 3. Save Data
    const handleSave = () => {
        const d = parseFloat(depth) || 0;
        const w = parseFloat(pwidth) || 0;
        const a = parseFloat(area) || 0;
        onMeasurementComplete(d, w, a); // Severity can be added to callback if parent supports it
        onClose();
    };

    // Renders
    if (!device || !hasPermission) {
        return (
            <Modal visible={visible} transparent={false} onRequestClose={onClose}>
                <View style={[cstyles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                    <Text style={[styles.title, { marginBottom: 20 }]}>Camera Access Required</Text>
                    <TouchableOpacity onPress={onClose} style={[styles.simpleButton, { backgroundColor: colors.buttonLoginBg }]}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        );
    }

    return (
        <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
            <View style={[cstyles.container, { backgroundColor: colors.background }]}>

                {/* Header */}
                <View style={cstyles.header}>
                    <Text style={[styles.title, { fontSize: 20 }]}>
                        {workflowState === 'camera' ? '📸 AI Capture' :
                            workflowState === 'preview' ? '📤 Review & Upload' :
                                workflowState === 'analyzing' ? '⏳ Analyzing...' : '📊 AI Results'}
                    </Text>
                    <TouchableOpacity onPress={onClose} style={cstyles.closeButton}>
                        <Text style={[styles.buttonText, { fontSize: 24 }]}>×</Text>
                    </TouchableOpacity>
                </View>

                {/* Content Area */}
                <View style={{ flex: 1, position: 'relative' }}>

                    {/* STATE: CAMERA */}
                    {workflowState === 'camera' && (
                        <View style={{ flex: 1, margin: 20, borderRadius: 20, overflow: 'hidden' }}>
                            <Camera
                                ref={camera}
                                style={StyleSheet.absoluteFill}
                                device={device}
                                isActive={visible && workflowState === 'camera'}
                                photo={true}
                            />
                            {/* Overlay Guides */}
                            <View style={cstyles.crosshair}>
                                <View style={cstyles.crosshairHorizontal} />
                                <View style={cstyles.crosshairVertical} />
                            </View>
                            <Text style={{ position: 'absolute', bottom: 20, alignSelf: 'center', color: '#fff', backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 8 }}>
                                Ensure pothole is centered and clearly visible
                            </Text>
                        </View>
                    )}

                    {/* STATE: PREVIEW / ANALYZING / RESULTS */}
                    {(workflowState === 'preview' || workflowState === 'analyzing' || workflowState === 'results') && capturedPhotoPath && (
                        <View style={{ flex: 1, margin: 20, borderRadius: 20, overflow: 'hidden' }}>
                            <Image
                                source={{ uri: capturedPhotoPath }}
                                style={{ flex: 1, width: '100%', height: '100%' }}
                                resizeMode="cover"
                            />

                            {/* Loading Overlay */}
                            {workflowState === 'analyzing' && (
                                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' }]}>
                                    <ActivityIndicator size="large" color="#00ff00" />
                                    <Text style={{ color: '#00ff00', marginTop: 20, fontSize: 18, fontWeight: 'bold' }}>Uploading to Gemini...</Text>
                                    <Text style={{ color: '#ccc', marginTop: 10 }}>Analyzing geometry & depth</Text>
                                </View>
                            )}
                        </View>
                    )}
                </View>

                {/* Controls Area */}
                <View style={[cstyles.controlsContainer, { paddingBottom: 40 }]}>

                    {/* CONTROLS: CAMERA */}
                    {workflowState === 'camera' && (
                        <TouchableOpacity
                            onPress={handleCapture}
                            style={{
                                width: 80, height: 80, borderRadius: 40,
                                backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center',
                                borderWidth: 5, borderColor: 'rgba(255,255,255,0.3)'
                            }}
                        >
                            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.buttonLoginBg, borderWidth: 2, borderColor: '#fff' }} />
                        </TouchableOpacity>
                    )}

                    {/* CONTROLS: PREVIEW */}
                    {workflowState === 'preview' && (
                        <View style={{ flexDirection: 'row', gap: 20 }}>
                            <TouchableOpacity
                                onPress={() => setWorkflowState('camera')}
                                style={[styles.simpleButton, { backgroundColor: colors.mediaAddButton, width: width * 0.4 }]}
                            >
                                <Text style={styles.buttonText}>Start Over</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handleAnalyze}
                                style={[styles.simpleButton, { backgroundColor: colors.buttonLoginBg, width: width * 0.4 }]}
                            >
                                <Text style={styles.buttonText}>⚡ Analyze</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* CONTROLS: RESULTS UI OVERLAY */}
                    {workflowState === 'results' && (
                        <View style={{ width: '100%', paddingHorizontal: 20 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, flexWrap: 'wrap' }}>
                                <View style={[cstyles.resultBox, { width: '45%', marginBottom: 10 }]}>
                                    <Text style={{ color: '#aaa', fontSize: 12 }}>Depth (cm)</Text>
                                    <TextInput
                                        value={depth}
                                        onChangeText={setDepth}
                                        keyboardType="numeric"
                                        style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', borderBottomColor: '#555', borderBottomWidth: 1 }}
                                    />
                                </View>
                                <View style={[cstyles.resultBox, { width: '45%', marginBottom: 10 }]}>
                                    <Text style={{ color: '#aaa', fontSize: 12 }}>Width (cm)</Text>
                                    <TextInput
                                        value={pwidth}
                                        onChangeText={setPWidth}
                                        keyboardType="numeric"
                                        style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', borderBottomColor: '#555', borderBottomWidth: 1 }}
                                    />
                                </View>
                                <View style={[cstyles.resultBox, { width: '45%' }]}>
                                    <Text style={{ color: '#aaa', fontSize: 12 }}>Area (m²)</Text>
                                    <TextInput
                                        value={area}
                                        onChangeText={setArea}
                                        keyboardType="numeric"
                                        style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', borderBottomColor: '#555', borderBottomWidth: 1 }}
                                    />
                                </View>
                                <View style={[cstyles.resultBox, { width: '45%' }]}>
                                    <Text style={{ color: '#aaa', fontSize: 12 }}>Severity/Type</Text>
                                    <TextInput
                                        value={severity}
                                        onChangeText={setSeverity}
                                        placeholder="Normal"
                                        placeholderTextColor="#666"
                                        style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', borderBottomColor: '#555', borderBottomWidth: 1 }}
                                    />
                                </View>
                            </View>

                            <Text style={{ color: confidence > 0.7 ? '#00ff00' : 'orange', alignSelf: 'center', marginBottom: 20 }}>
                                AI Confidence: {(confidence * 100).toFixed(0)}%
                            </Text>

                            <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => setWorkflowState('camera')}
                                    style={[styles.simpleButton, { backgroundColor: colors.mediaAddButton, width: width * 0.4 }]}
                                >
                                    <Text style={styles.buttonText}>Retake</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSave}
                                    style={[styles.simpleButton, { backgroundColor: colors.buttonLoginBg, width: width * 0.4 }]}
                                >
                                    <Text style={styles.buttonText}>✅ Save Data</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                </View>
            </View>
        </Modal>
    );
}

const cstyles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 10 },
    closeButton: { padding: 5 },
    controlsContainer: { alignItems: 'center', justifyContent: 'flex-end' },
    crosshair: { position: 'absolute', top: '50%', left: '50%', width: 40, height: 40, marginLeft: -20, marginTop: -20 },
    crosshairHorizontal: { position: 'absolute', top: '50%', left: 0, right: 0, height: 2, backgroundColor: '#fff', opacity: 0.7 },
    crosshairVertical: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 2, backgroundColor: '#fff', opacity: 0.7 },
    resultBox: { width: '30%', backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 8 }
});