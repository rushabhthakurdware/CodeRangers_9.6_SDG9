import { DetectedPothole } from './PotholeDetector';

/**
 * Camera intrinsics for AR calculations
 * These will be obtained from the camera device
 */
export interface CameraIntrinsics {
    focalLengthX: number;
    focalLengthY: number;
    principalPointX: number;
    principalPointY: number;
    imageWidth: number;
    imageHeight: number;
}

/**
 * 3D point in world space
 */
export interface Point3D {
    x: number;
    y: number;
    z: number;
}

/**
 * Pothole measurement result
 */
export interface PotholeMeasurement {
    width: number;  // in cm
    depth: number;  // in cm (if available)
    area: number;   // in cm²
    distance: number; // distance from camera in meters
    confidence: number;
}

/**
 * Convert 2D pixel coordinates to 3D world coordinates using AR raycasting
 * 
 * Formula: realWorldSize = (pixelSize × distance) / focalLength
 */
export function calculateRealWorldDimensions(
    pothole: DetectedPothole,
    distanceToPlane: number, // in meters
    intrinsics: CameraIntrinsics
): { width: number; height: number } {
    // Convert normalized coordinates back to pixels
    const pixelWidth = pothole.width * intrinsics.imageWidth;
    const pixelHeight = pothole.height * intrinsics.imageHeight;

    // Calculate real-world dimensions
    // Formula: realWidth = (pixelWidth × distance) / focalLength
    const realWidth = (pixelWidth * distanceToPlane) / intrinsics.focalLengthX;
    const realHeight = (pixelHeight * distanceToPlane) / intrinsics.focalLengthY;

    // Convert from meters to centimeters
    return {
        width: realWidth * 100,
        height: realHeight * 100,
    };
}

/**
 * Project a 2D pixel coordinate to a 3D ray direction
 */
export function pixelToRay(
    pixelX: number,
    pixelY: number,
    intrinsics: CameraIntrinsics
): { x: number; y: number; z: number } {
    // Normalize pixel coordinates
    const x = (pixelX - intrinsics.principalPointX) / intrinsics.focalLengthX;
    const y = (pixelY - intrinsics.principalPointY) / intrinsics.focalLengthY;
    const z = 1.0;

    // Normalize the vector
    const length = Math.sqrt(x * x + y * y + z * z);

    return {
        x: x / length,
        y: y / length,
        z: z / length,
    };
}

/**
 * Calculate Euclidean distance between two 3D points
 */
export function calculateDistance(p1: Point3D, p2: Point3D): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Calculate vertical depth between two points (Y-axis difference)
 */
export function calculateDepth(topPoint: Point3D, bottomPoint: Point3D): number {
    // Y-axis represents vertical in AR space
    return Math.abs(topPoint.y - bottomPoint.y) * 100; // Convert to cm
}

/**
 * Calculate horizontal width between two points (XZ plane distance)
 */
export function calculateWidth(point1: Point3D, point2: Point3D): number {
    const dx = point2.x - point1.x;
    const dz = point2.z - point1.z;

    return Math.sqrt(dx * dx + dz * dz) * 100; // Convert to cm
}

/**
 * Estimate pothole area from width and height
 * Assumes roughly elliptical shape
 */
export function calculateArea(width: number, height: number): number {
    // Area of ellipse: π × (width/2) × (height/2)
    return Math.PI * (width / 2) * (height / 2);
}

/**
 * Create a complete pothole measurement from detection and AR data
 */
export function createPotholeMeasurement(
    pothole: DetectedPothole,
    distanceToPlane: number,
    intrinsics: CameraIntrinsics,
    depth?: number
): PotholeMeasurement {
    const dimensions = calculateRealWorldDimensions(
        pothole,
        distanceToPlane,
        intrinsics
    );

    const area = calculateArea(dimensions.width, dimensions.height);

    return {
        width: dimensions.width,
        depth: depth || 0,
        area,
        distance: distanceToPlane,
        confidence: pothole.confidence,
    };
}

/**
 * Default camera intrinsics for typical smartphone camera
 * These should ideally be obtained from the actual camera device
 */
export function getDefaultCameraIntrinsics(
    imageWidth: number,
    imageHeight: number
): CameraIntrinsics {
    // Typical smartphone field of view is around 60-70 degrees
    // Focal length ≈ imageWidth / (2 × tan(FOV/2))
    const fov = 65 * (Math.PI / 180); // 65 degrees in radians
    const focalLength = imageWidth / (2 * Math.tan(fov / 2));

    return {
        focalLengthX: focalLength,
        focalLengthY: focalLength,
        principalPointX: imageWidth / 2,
        principalPointY: imageHeight / 2,
        imageWidth,
        imageHeight,
    };
}
