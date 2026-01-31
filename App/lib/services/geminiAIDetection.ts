import Constants from 'expo-constants';

const GEMINI_API_KEY = Constants.expoConfig?.extra?.geminiApiKey || 'YOUR_API_KEY_HERE';

export interface MeasurementResult {
    width?: number; // cm
    height?: number; // cm
    depth?: number; // cm
    area?: number; // m²
    confidence?: number;
    description?: string;
}

/**
 * Analyze image using Gemini Vision API to detect pothole measurements
 * @param imageUri - Base64 encoded image or file URI
 * @returns Measurement data (width, height, area)
 */
export async function analyzeImageWithGemini(imageUri: string): Promise<MeasurementResult> {
    try {
        // Convert image to base64 if needed
        let base64Image = imageUri;
        if (imageUri.startsWith('file://') || imageUri.startsWith('content://')) {
            // Read file and convert to base64
            const response = await fetch(imageUri);
            const blob = await response.blob();
            base64Image = await blobToBase64(blob);
        }

        // Remove data URL prefix if present
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

        const prompt = `Analyze this image of a road surface defect (pothole or crack).
        
Please provide measurements in the following format:
- Width (in centimeters)
- Depth/Height (in centimeters)  
- Estimated area (in square meters)
- Confidence level (0-1)
- Brief description

If the defect is not clearly visible or cannot be measured, indicate low confidence.
Return your response as JSON with fields: width, height, depth, area, confidence, description.`;

        const requestBody = {
            contents: [{
                parts: [
                    { text: prompt },
                    {
                        inline_data: {
                            mime_type: "image/jpeg",
                            data: base64Data
                        }
                    }
                ]
            }],
            generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 1024,
            }
        };

        if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
            console.error('Gemini API Key is missing or invalid');
            throw new Error('Gemini API Key is missing. Check your .env file and app.config.js');
        }
        console.log(`Using Gemini API Key: ${GEMINI_API_KEY.substring(0, 4)}...`);

        // User confirmed available model: Gemini 2.5 Flash (Multi-modal)
        const model = 'gemini-2.5-flash';

        console.log(`Trying Gemini Model: ${model}...`);

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error Detail:', errorText);
            throw new Error(`Gemini API error with model ${model}: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Gemini API Response:', JSON.stringify(data, null, 2));

        // Parse response
        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log('Gemini Text Response:', textResponse);

        // Try to extract JSON from response
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const measurements = JSON.parse(jsonMatch[0]);
            return {
                width: parseFloat(measurements.width) || undefined,
                height: parseFloat(measurements.height) || parseFloat(measurements.depth) || undefined,
                depth: parseFloat(measurements.depth) || undefined,
                area: parseFloat(measurements.area) || undefined,
                confidence: parseFloat(measurements.confidence) || 0.5,
                description: measurements.description || 'AI detected measurements'
            };
        }

        // Fallback: parse from text
        return parseTextResponse(textResponse);

    } catch (error) {
        console.error('Gemini AI Detection Error:', error);
        throw error;
    }
}

/**
 * Convert Blob to base64 string
 */
function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = reader.result as string;
            resolve(base64.split(',')[1]); // Remove data URL prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Parse measurements from text response as fallback
 */
function parseTextResponse(text: string): MeasurementResult {
    const widthMatch = text.match(/width[:\s]+(\d+\.?\d*)/i);
    const heightMatch = text.match(/(?:height|depth)[:\s]+(\d+\.?\d*)/i);
    const areaMatch = text.match(/area[:\s]+(\d+\.?\d*)/i);
    const confidenceMatch = text.match(/confidence[:\s]+(\d+\.?\d*)/i);

    return {
        width: widthMatch ? parseFloat(widthMatch[1]) : undefined,
        height: heightMatch ? parseFloat(heightMatch[1]) : undefined,
        area: areaMatch ? parseFloat(areaMatch[1]) : undefined,
        confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.3,
        description: 'Extracted from AI text response'
    };
}
