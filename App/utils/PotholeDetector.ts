import { Worklets } from 'react-native-worklets-core';

/**
 * Pothole Detection Configuration
 */
export const DETECTION_CONFIG = {
    // Processing interval in milliseconds (1 second as requested)
    PROCESSING_INTERVAL: 1000,

    // Contour filtering parameters
    MIN_AREA: 500,        // Minimum area in pixels²
    MAX_AREA: 50000,      // Maximum area in pixels²
    MIN_CIRCULARITY: 0.3, // Allow irregular shapes
    MAX_CIRCULARITY: 0.9,
    MIN_ASPECT_RATIO: 0.5,
    MAX_ASPECT_RATIO: 2.0,

    // Edge detection thresholds
    CANNY_THRESHOLD_LOW: 50,
    CANNY_THRESHOLD_HIGH: 150,

    // Gaussian blur kernel size
    BLUR_KERNEL_SIZE: 5,

    // Confidence threshold for auto-measurement
    CONFIDENCE_THRESHOLD: 0.7,
};

/**
 * Detected pothole information
 */
export interface DetectedPothole {
    // Bounding box coordinates (normalized 0-1)
    x: number;
    y: number;
    width: number;
    height: number;

    // Center point (normalized 0-1)
    centerX: number;
    centerY: number;

    // Metadata
    area: number;
    circularity: number;
    confidence: number;
    timestamp: number;
}

/**
 * Calculate circularity of a contour
 * Circularity = (4 * π * area) / (perimeter²)
 * Perfect circle = 1.0, irregular shapes < 1.0
 */
function calculateCircularity(area: number, perimeter: number): number {
    if (perimeter === 0) return 0;
    return (4 * Math.PI * area) / (perimeter * perimeter);
}

/**
 * Calculate confidence score based on pothole characteristics
 */
function calculateConfidence(
    area: number,
    circularity: number,
    aspectRatio: number
): number {
    const { MIN_AREA, MAX_AREA, MIN_CIRCULARITY, MAX_CIRCULARITY } = DETECTION_CONFIG;

    // Area score: prefer medium-sized potholes
    const idealArea = (MIN_AREA + MAX_AREA) / 2;
    const areaScore = 1 - Math.abs(area - idealArea) / idealArea;

    // Circularity score: prefer somewhat circular shapes
    const idealCircularity = (MIN_CIRCULARITY + MAX_CIRCULARITY) / 2;
    const circularityScore = 1 - Math.abs(circularity - idealCircularity) / idealCircularity;

    // Aspect ratio score: prefer square-ish shapes
    const aspectRatioScore = 1 - Math.abs(aspectRatio - 1.0);

    // Weighted average
    return (
        areaScore * 0.4 +
        circularityScore * 0.4 +
        aspectRatioScore * 0.2
    );
}

/**
 * Process frame with OpenCV to detect potholes
 * This function will be called from the frame processor
 */
export async function processPotholeDetection(
    frameMat: any, // OpenCV Mat object
    frameWidth: number,
    frameHeight: number,
    cv: any // OpenCV instance
): Promise<DetectedPothole[]> {
    try {
        const detectedPotholes: DetectedPothole[] = [];

        // Step 1: Convert to grayscale
        const gray = new cv.Mat();
        cv.cvtColor(frameMat, gray, cv.COLOR_RGBA2GRAY);

        // Step 2: Apply Gaussian blur to reduce noise
        const blurred = new cv.Mat();
        const ksize = new cv.Size(DETECTION_CONFIG.BLUR_KERNEL_SIZE, DETECTION_CONFIG.BLUR_KERNEL_SIZE);
        cv.GaussianBlur(gray, blurred, ksize, 0, 0, cv.BORDER_DEFAULT);

        // Step 3: Apply Otsu's thresholding to isolate dark regions (potholes)
        const thresh = new cv.Mat();
        cv.threshold(
            blurred,
            thresh,
            0,
            255,
            cv.THRESH_BINARY_INV + cv.THRESH_OTSU
        );

        // Step 4: Canny edge detection
        const edges = new cv.Mat();
        cv.Canny(
            thresh,
            edges,
            DETECTION_CONFIG.CANNY_THRESHOLD_LOW,
            DETECTION_CONFIG.CANNY_THRESHOLD_HIGH
        );

        // Step 5: Find contours
        const contours = new cv.MatVector();
        const hierarchy = new cv.Mat();
        cv.findContours(
            edges,
            contours,
            hierarchy,
            cv.RETR_EXTERNAL,
            cv.CHAIN_APPROX_SIMPLE
        );

        // Step 6: Filter and process contours
        for (let i = 0; i < contours.size(); i++) {
            const contour = contours.get(i);
            const area = cv.contourArea(contour);
            const perimeter = cv.arcLength(contour, true);

            // Apply area filter
            if (area < DETECTION_CONFIG.MIN_AREA || area > DETECTION_CONFIG.MAX_AREA) {
                continue;
            }

            // Get bounding rectangle
            const rect = cv.boundingRect(contour);
            const aspectRatio = rect.width / rect.height;

            // Apply aspect ratio filter
            if (
                aspectRatio < DETECTION_CONFIG.MIN_ASPECT_RATIO ||
                aspectRatio > DETECTION_CONFIG.MAX_ASPECT_RATIO
            ) {
                continue;
            }

            // Calculate circularity
            const circularity = calculateCircularity(area, perimeter);

            // Apply circularity filter
            if (
                circularity < DETECTION_CONFIG.MIN_CIRCULARITY ||
                circularity > DETECTION_CONFIG.MAX_CIRCULARITY
            ) {
                continue;
            }

            // Calculate confidence score
            const confidence = calculateConfidence(area, circularity, aspectRatio);

            // Only include high-confidence detections
            if (confidence < DETECTION_CONFIG.CONFIDENCE_THRESHOLD) {
                continue;
            }

            // Normalize coordinates to 0-1 range
            const pothole: DetectedPothole = {
                x: rect.x / frameWidth,
                y: rect.y / frameHeight,
                width: rect.width / frameWidth,
                height: rect.height / frameHeight,
                centerX: (rect.x + rect.width / 2) / frameWidth,
                centerY: (rect.y + rect.height / 2) / frameHeight,
                area,
                circularity,
                confidence,
                timestamp: Date.now(),
            };

            detectedPotholes.push(pothole);
        }

        // Cleanup
        gray.delete();
        blurred.delete();
        thresh.delete();
        edges.delete();
        contours.delete();
        hierarchy.delete();

        return detectedPotholes;
    } catch (error) {
        console.error('Pothole detection error:', error);
        return [];
    }
}

/**
 * Debounce detections to avoid duplicate measurements
 * Requires N consecutive detections in the same region
 */
export class PotholeDetectionDebouncer {
    private detectionHistory: DetectedPothole[][] = [];
    private readonly requiredConsecutiveDetections = 3;
    private readonly maxHistoryLength = 5;

    /**
     * Add new detection and check if it's stable
     */
    addDetection(potholes: DetectedPothole[]): DetectedPothole | null {
        this.detectionHistory.push(potholes);

        // Keep only recent history
        if (this.detectionHistory.length > this.maxHistoryLength) {
            this.detectionHistory.shift();
        }

        // Check if we have enough consecutive detections
        if (this.detectionHistory.length < this.requiredConsecutiveDetections) {
            return null;
        }

        // Find consistent detection across last N frames
        const recentDetections = this.detectionHistory.slice(-this.requiredConsecutiveDetections);

        // Check if all recent frames have at least one detection
        if (recentDetections.some(frame => frame.length === 0)) {
            return null;
        }

        // Find overlapping pothole across frames
        const firstFrame = recentDetections[0];
        for (const pothole of firstFrame) {
            let isConsistent = true;

            for (let i = 1; i < recentDetections.length; i++) {
                const hasOverlap = recentDetections[i].some(
                    p => this.calculateOverlap(pothole, p) > 0.5
                );

                if (!hasOverlap) {
                    isConsistent = false;
                    break;
                }
            }

            if (isConsistent) {
                // Clear history after successful detection
                this.detectionHistory = [];
                return pothole;
            }
        }

        return null;
    }

    /**
     * Calculate overlap ratio between two detections
     */
    private calculateOverlap(a: DetectedPothole, b: DetectedPothole): number {
        const xOverlap = Math.max(
            0,
            Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)
        );
        const yOverlap = Math.max(
            0,
            Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)
        );

        const overlapArea = xOverlap * yOverlap;
        const aArea = a.width * a.height;
        const bArea = b.width * b.height;
        const unionArea = aArea + bArea - overlapArea;

        return unionArea > 0 ? overlapArea / unionArea : 0;
    }

    reset() {
        this.detectionHistory = [];
    }
}
