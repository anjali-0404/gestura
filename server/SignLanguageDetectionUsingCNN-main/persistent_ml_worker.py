import sys
import json
import os
import cv2
import numpy as np
from pathlib import Path
import tensorflow as tf

# Add the model directory to path
model_dir = Path(__file__).parent
sys.path.insert(0, str(model_dir))

def load_model():
    model_path = model_dir / 'signlanguagedetectionmodel48x48.h5'
    if model_path.exists():
        return tf.keras.models.load_model(str(model_path))
    else:
        raise Exception(f"Model not found at {model_path}")

def preprocess_image(image_path, target_size=(48, 48)):
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError("Could not read image file")
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.resize(img, target_size)
    img = np.array(img).reshape(1, 48, 48, 1)
    img = img.astype('float32') / 255.0
    return img

def detect_from_image(image_path, model):
    img = preprocess_image(image_path)
    predictions = model.predict(img, verbose=0)
    class_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][class_idx])
    labels = ['A', 'M', 'N', 'S', 'T', 'blank']
    sign_label = labels[class_idx] if class_idx < len(labels) else f'Unknown_{class_idx}'
    return {
        "sign": sign_label,
        "confidence": confidence,
        "predictions": predictions[0].tolist(),
        "type": "image"
    }

def detect_from_video(video_path, model, frame_interval=10):
    cap = cv2.VideoCapture(video_path)
    frame_count = 0
    detected_signs = []
    labels = ['A', 'M', 'N', 'S', 'T', 'blank']
    
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        
        if frame_count % frame_interval == 0:
            h, w = frame.shape[:2]
            if h >= 300 and w >= 300:
                crop = frame[40:300, 0:300]
            else:
                crop = frame
            
            crop = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
            crop = cv2.resize(crop, (48, 48))
            processed = np.array(crop).reshape(1, 48, 48, 1).astype('float32') / 255.0
            
            preds = model.predict(processed, verbose=0)
            idx = np.argmax(preds[0])
            conf = float(preds[0][idx])
            
            detected_signs.append({
                "frame": frame_count,
                "sign": labels[idx] if idx < len(labels) else f'Unknown_{idx}',
                "confidence": conf
            })
        
        frame_count += 1
    
    cap.release()
    
    if detected_signs:
        best = max(detected_signs, key=lambda x: x['confidence'])
        return {
            "sign": best['sign'],
            "confidence": best['confidence'],
            "frames_processed": frame_count,
            "detections": detected_signs,
            "type": "video"
        }
    else:
        return {"error": "No detections", "type": "video"}

def main():
    try:
        # Load model once at startup
        model = load_model()
        # Signal to Node.js that we are ready
        # Using stdout for JSON communication
        sys.stdout.write(json.dumps({"status": "ready"}) + "\n")
        sys.stdout.flush()

        # Loop to process requests from stdin
        while True:
            line = sys.stdin.readline()
            if not line:
                break
            try:
                request = json.loads(line)
                file_path = request.get('file')
                file_type = request.get('type', 'image')
                
                if not file_path or not os.path.exists(file_path):
                    sys.stdout.write(json.dumps({"error": f"File not found: {file_path}"}) + "\n")
                    sys.stdout.flush()
                    continue

                if file_type == 'image':
                    result = detect_from_image(file_path, model)
                    sys.stdout.write(json.dumps(result) + "\n")
                    sys.stdout.flush()
                else:
                    result = detect_from_video(file_path, model)
                    sys.stdout.write(json.dumps(result) + "\n")
                    sys.stdout.flush()
            except Exception as e:
                sys.stdout.write(json.dumps({"error": str(e)}) + "\n")
                sys.stdout.flush()
    except Exception as e:
        sys.stdout.write(json.dumps({"error": f"Worker initialization failed: {str(e)}"}) + "\n")
        sys.stdout.flush()
        sys.exit(1)

if __name__ == '__main__':
    main()
