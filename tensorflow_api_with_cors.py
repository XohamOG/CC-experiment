PublicIPs: 18.212.76.45  """
TensorFlow Flask API with CORS Enabled
Copy this entire file to your TensorFlow EC2 instance
"""

from flask import Flask, request, jsonify
from flask_cors import CORS  # ← CORS IMPORT
import tensorflow as tf
import numpy as np

app = Flask(__name__)
CORS(app)  # ← ENABLE CORS - This fixes the browser error!

# Load your trained model
# Uncomment and update path to your actual model:
# model = tf.keras.models.load_model('path/to/your/model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint: POST /predict
    Request: { "text": "some text to analyze" }
    Response: { "input_text": "...", "prediction": "Hate Speech" | "Normal", "confidence": 0.95 }
    """
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        # ============================================
        # TODO: Replace this with your actual model prediction
        # ============================================
        # Example preprocessing and prediction:
        # processed_text = preprocess(text)  # Your preprocessing function
        # prediction = model.predict(processed_text)
        # confidence = float(np.max(prediction))
        # is_hate = prediction[0][1] > 0.5
        # label = "Hate Speech" if is_hate else "Normal"
        
        # TEMPORARY: Simple keyword detection (replace with your model)
        is_hate = any(word in text.lower() for word in ['hate', 'kill', 'die', 'stupid'])
        label = "Hate Speech" if is_hate else "Normal"
        confidence = 0.85 if is_hate else 0.92
        
        return jsonify({
            'input_text': text,
            'prediction': label,
            'confidence': confidence
        })
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'TensorFlow API is running',
        'cors_enabled': True,
        'endpoint': '/predict',
        'method': 'POST'
    })

@app.route('/test', methods=['GET'])
def test():
    """Quick test endpoint to verify CORS"""
    return jsonify({
        'message': 'CORS is working!',
        'cors_enabled': True
    })

if __name__ == '__main__':
    print("=" * 50)
    print("🔵 TensorFlow Flask API Starting...")
    print("=" * 50)
    print("✅ CORS: Enabled")
    print("🌐 Host: 0.0.0.0 (accessible externally)")
    print("🔌 Port: 5000")
    print("📍 Endpoint: POST /predict")
    print("💚 Health: GET /")
    print("=" * 50)
    
    # Run on all interfaces (0.0.0.0) so it's accessible from outside EC2
    app.run(host='0.0.0.0', port=5000, debug=False)
