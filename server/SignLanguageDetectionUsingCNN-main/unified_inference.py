import sys
import json
import argparse
import cv2
import numpy as np
import os
from pathlib import Path
import tensorflow as tf

# Add the model directory to path
model_dir = Path(__file__).parent
sys.path.insert(0, str(model_dir))

def load_model():
    try:
        model_path = model_dir / 'signlanguagedetectionmodel48x48.h5'
        if model_path.exists():
            # The .h5 file likely contains the full model (architecture + weights)
            # if it was saved using model.save('path.h5')
            model = tf.keras.models.load_model(str(model_path))
            return model
        else:
            print(json.dumps({
                "error": "Model not found",
                "path": str(model_path)
            }), file=sys.stdout)
            sys.exit(1)
    except Exception as e:
        print(json.dumps({
            "error": "Failed to load model",
            "message": str(e)
        }), file=sys.stdout)
        sys.exit(1)

def preprocess_image(image_path, target_size=(48, 48)):
    try:
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Could not read image file")
        
        # Convert to grayscale as per realtimedetection.py logic
        img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Resize to 48x48
        img = cv2.resize(img, target_size)
        
        # Preprocess as per extract_features logic: reshape(1,48,48,1) / 255.0
        img = np.array(img).reshape(1, 48, 48, 1)
        img = img.astype('float32') / 255.0
        
        return img
    except Exception as e:
        raise Exception(f"Image preprocessing failed: {str(e)}")

def detect_from_image(image_path, model):
    try:
        img = preprocess_image(image_path)
        predictions = model.predict(img, verbose=0)
        
        class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][class_idx])
        
        # Label mapping from realtimedetection.py
        labels = ['A', 'M', 'N', 'S', 'T', 'blank']
        sign_label = labels[class_idx] if class_idx < len(labels) else f'Unknown_{class_idx}'
        
        return {
            "sign": sign_label,
            "confidence": confidence,
            "predictions": predictions[0].tolist(),
            "type": "image"
        }
    except Exception as e:
        raise Exception(f"Image detection failed: {str(e)}")

def detect_from_video(video_path, model, frame_interval=10):
    try:
        cap = cv2.VideoCapture(video_path)
        frame_count = 0
        detected_signs = []
        labels = ['A', 'M', 'N', 'S', 'T', 'blank']
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            if frame_count % frame_interval == 0:
                # Process frame (ROI logic from realtimedetection.py: [40:300, 0:300])
                # Check if frame is large enough for this crop
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
    except Exception as e:
        raise Exception(f"Video detection failed: {str(e)}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--file', required=True)
    parser.add_argument('--type', required=True, choices=['image', 'video'])
    
    args = parser.parse_args()
    
    try:
        if not os.path.exists(args.file):
            print(json.dumps({"error": "File not found"}), file=sys.stdout)
            sys.exit(1)
        
        model = load_model()
        
        if args.type == 'image':
            result = detect_from_image(args.file, model)
        else:
            result = detect_from_video(args.file, model)
        
        print(json.dumps(result), file=sys.stdout)
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stdout)
        sys.exit(1)

if __name__ == '__main__':
    main()
