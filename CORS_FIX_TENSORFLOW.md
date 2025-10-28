# 🔧 CORS Fix for TensorFlow Flask API

## Problem
API works in terminal but fails in browser with "Failed to fetch" error.

**Cause:** Flask needs to enable CORS (Cross-Origin Resource Sharing) to allow browser requests.

---

## Solution 1: Quick Fix (Add to existing app.py)

### Install flask-cors
```bash
pip install flask-cors
```

### Update your app.py
Add these two lines at the top:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS  # ← ADD THIS

app = Flask(__name__)
CORS(app)  # ← ADD THIS - Enables CORS for all routes

# ... rest of your code
```

**That's it!** Restart your Flask app and it will work in the browser.

---

## Solution 2: Specific CORS Configuration (More Secure)

For production, specify which origins can access your API:

```python
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Allow only your frontend domain
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173"],
        "methods": ["GET", "POST"],
        "allow_headers": ["Content-Type"]
    }
})

# ... rest of your code
```

---

## Complete Example app.py

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np

app = Flask(__name__)
CORS(app)  # ← Enable CORS

# Load your model
# model = tf.keras.models.load_model('path/to/model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Empty text'}), 400
        
        # Your prediction logic here
        # prediction = model.predict(preprocessed_text)
        
        # Example response
        return jsonify({
            'input_text': text,
            'prediction': 'Hate Speech' if 'hate' in text.lower() else 'Normal',
            'confidence': 0.95
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/', methods=['GET'])
def health():
    return jsonify({'status': 'TensorFlow API is running'})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
```

---

## Restart Flask App

```bash
# Stop current Flask app (Ctrl+C)

# Restart with CORS enabled
python3 app.py

# Or if using nohup
pkill -f "python3 app.py"
nohup python3 app.py > flask.log 2>&1 &
```

---

## Verify CORS is Working

### Check Response Headers
```bash
curl -i -X OPTIONS http://54.205.124.174:5000/predict \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST"
```

You should see:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
```

### Test from Browser Console
Open `http://localhost:3000`, press F12, and run:

```javascript
fetch('http://54.205.124.174:5000/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'I hate you' })
})
.then(r => r.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

If you see `Success:` with data, CORS is fixed! ✅

---

## Common Issues

### 1. flask-cors not installed
```bash
pip3 install flask-cors
```

### 2. CORS import error
Make sure you're using:
```python
from flask_cors import CORS  # Correct
# not: from flask.cors import CORS  # Wrong
```

### 3. Still getting CORS error
- Restart Flask app completely
- Clear browser cache (Ctrl+Shift+Del)
- Check Flask is running on 0.0.0.0 (not 127.0.0.1)

---

## After Applying Fix

Your browser console should show:
```
✅ TensorFlow result: { success: true, prediction: "hate_speech", confidence: 0.95 }
```

Instead of:
```
❌ CORS Error: TensorFlow API needs to enable CORS
```
