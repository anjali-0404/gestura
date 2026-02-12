#!/usr/bin/env python3
"""
Python wrapper script for sign language detection
This script is called by the Node.js backend to perform ML inference
"""

import sys
import json
import argparse
import cv2
import numpy as np
import os
from pathlib import Path

# Add the model directory to path
model_dir = Path(__file__).parent
sys.path.insert(0, str(model_dir))

def load_model():
    """
    Load the trained CNN model
    This function should load your trained TensorFlow model
    """
    try:
        # Import TensorFlow
        import tensorflow as tf
        
        # Try to load model from saved location
        model_path = model_dir / 'model' / 'sign_language_model.h5'
        
        if model_path.exists():
            model = tf.keras.models.load_model(str(model_path))
            return model
        else:
            # If model doesn't exist, return a placeholder
            print(json.dumps({
                "error": "Model not found",
                "path": str(model_path),
                "message": "Please train and save the model first"
            }), file=sys.stdout)
            sys.exit(1)
    except ImportError:
        print(json.dumps({
            "error": "TensorFlow not installed",
            "message": "Please install TensorFlow: pip install tensorflow"
        }), file=sys.stdout)
        sys.exit(1)
    except Exception as e:
        print(json.dumps({
            "error": "Failed to load model",
            "message": str(e)
        }), file=sys.stdout)
        sys.exit(1)

def preprocess_image(image_path, target_size=(224, 224)):
    """
    Preprocess image for model inference
    """
    try:
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Could not read image file")
        
        # Resize to target size
        img = cv2.resize(img, target_size)
        
        # Normalize pixel values
        img = img.astype('float32') / 255.0
        
        # Add batch dimension
        img = np.expand_dims(img, axis=0)
        
        return img
    except Exception as e:
        raise Exception(f"Image preprocessing failed: {str(e)}")

def detect_from_image(image_path, model):
    """
    Perform sign language detection on an image
    """
    try:
        # Preprocess image
        img = preprocess_image(image_path)
        
        # Make prediction
        predictions = model.predict(img)
        
        # Get the class with highest probability
        class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][class_idx])
        
        # Map class index to sign label (modify based on your classes)
        classes = ['Sign_A', 'Sign_B', 'Sign_C']  # Replace with actual classes
        sign_label = classes[class_idx] if class_idx < len(classes) else f'Sign_{class_idx}'
        
        return {
            "sign": sign_label,
            "confidence": confidence,
            "predictions": predictions[0].tolist(),
            "type": "image"
        }
    except Exception as e:
        raise Exception(f"Image detection failed: {str(e)}")

def detect_from_video(video_path, model, frame_interval=5):
    """
    Perform sign language detection on video frames
    """
    try:
        cap = cv2.VideoCapture(video_path)
        frame_count = 0
        detected_signs = []
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            # Process every nth frame to improve performance
            if frame_count % frame_interval == 0:
                # Resize and normalize frame
                frame = cv2.resize(frame, (224, 224))
                frame = frame.astype('float32') / 255.0
                frame = np.expand_dims(frame, axis=0)
                
                # Make prediction
                predictions = model.predict(frame, verbose=0)
                class_idx = np.argmax(predictions[0])
                confidence = float(predictions[0][class_idx])
                
                classes = ['Sign_A', 'Sign_B', 'Sign_C']  # Replace with actual classes
                sign_label = classes[class_idx] if class_idx < len(classes) else f'Sign_{class_idx}'
                
                detected_signs.append({
                    "frame": frame_count,
                    "sign": sign_label,
                    "confidence": confidence
                })
            
            frame_count += 1
        
        cap.release()
        
        if detected_signs:
            # Get most confident detection
            best_detection = max(detected_signs, key=lambda x: x['confidence'])
            return {
                "sign": best_detection['sign'],
                "confidence": best_detection['confidence'],
                "frames_processed": frame_count,
                "detections": detected_signs,
                "type": "video"
            }
        else:
            return {
                "error": "No frames could be processed",
                "type": "video"
            }
    except Exception as e:
        raise Exception(f"Video detection failed: {str(e)}")

def main():
    parser = argparse.ArgumentParser(description='Sign Language Detection')
    parser.add_argument('--file', required=True, help='Path to input file')
    parser.add_argument('--type', required=True, choices=['image', 'video'], help='File type')
    
    args = parser.parse_args()
    
    try:
        # Check if file exists
        if not os.path.exists(args.file):
            print(json.dumps({
                "error": "File not found",
                "path": args.file
            }), file=sys.stdout)
            sys.exit(1)
        
        # Load model
        model = load_model()
        
        # Perform detection based on file type
        if args.type == 'image':
            result = detect_from_image(args.file, model)
        else:
            result = detect_from_video(args.file, model)
        
        # Output result as JSON
        print(json.dumps(result), file=sys.stdout)
        sys.exit(0)
    
    except Exception as e:
        error_result = {
            "error": str(e),
            "file": args.file,
            "type": args.type
        }
        print(json.dumps(error_result), file=sys.stdout)
        sys.exit(1)

if __name__ == '__main__':
    main()
