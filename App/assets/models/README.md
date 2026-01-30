# TFLite Model Integration - Backend API Approach (Recommended)

## Why Backend API?

Due to React Native limitations and dependency conflicts with TensorFlow Lite libraries, the recommended approach is to use a backend API for YOLO inference:

**Advantages:**
- ✅ No complex native dependencies
- ✅ Easy model updates (no app rebuild needed)
- ✅ Better performance (server GPUs)
- ✅ Works with any YOLO version
- ✅ No app size increase

**Disadvantages:**
- ❌ Requires internet connection
- ❌ Slight latency (network delay)

## Backend API Setup

### Option 1: Python Flask/FastAPI Server

```python
from flask import Flask, request, jsonify
from ultralytics import YOLO
import base64
import io
from PIL import Image

app = Flask(__name__)
model = YOLO('path/to/your/model.pt')  # Load your trained model

@app.route('/detect', methods=['POST'])
def detect_pothole():
    # Get base64 image from request
    data = request.json
    image_data = base64.b64decode(data['image'])
    image = Image.open(io.BytesIO(image_data))
    
    # Run YOLO inference
    results = model(image, conf=0.5)
    
    # Parse results
    detections = []
    for r in results:
        boxes = r.boxes
        for box in boxes:
            detections.append({
                'class': model.names[int(box.cls[0])],
                'confidence': float(box.conf[0]),
                'bbox': {
                    'x': float(box.xyxy[0][0]),
                    'y': float(box.xyxy[0][1]),
                    'width': float(box.xyxy[0][2] - box.xyxy[0][0]),
                    'height': float(box.xyxy[0][3] - box.xyxy[0][1])
                }
            })
    
    return jsonify({'detections': detections})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

### Option 2: Use Existing Services

- **Roboflow**: Upload model, get API endpoint
- **Hugging Face Inference API**: Host model, call via API
- **Google Cloud Vision**: Custom model deployment

## React Native Integration

Update `utils/tfliteModel.ts` to call your API:

```typescript
async detectPotholes(imageUri: string): Promise<DetectionResult[]> {
  // Read image as base64
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Call your backend API
  const response = await fetch('YOUR_API_ENDPOINT/detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64 })
  });

  const data = await response.json();
  return data.detections;
}
```

## Current Implementation

The app currently uses **mock detection** (80% success rate) for testing the UI flow.

To integrate:
1. Deploy backend API with your YOLO model
2. Update API endpoint in `.env`:
   ```
   DETECTION_API_URL=https://your-server.com/detect
   ```
3. Update `utils/tfliteModel.ts` with API call
4. Test!

## Alternative: On-Device ML (Advanced)

If you MUST run on-device:

1. **Use React Native Skia + ONNX Runtime**:
   ```bash
   npm install onnxruntime-react-native
   ```
   Convert model: `yolo export format=onnx`

2. **Create Native Module** (Java/Kotlin for Android):
   - Use TensorFlow Lite Android library directly
   - Expose to React Native via bridge
   - More complex but full control

3. **Use Expo Modules API**:
   - Create custom Expo module
   - Wrap TFLite Android library
   - Better integration with Expo

Choose based on your needs!
