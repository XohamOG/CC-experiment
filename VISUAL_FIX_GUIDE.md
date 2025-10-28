# 🎯 CORS Fix - Visual Before/After Guide

## 🔵 TensorFlow Flask API

### ❌ BEFORE (Your current app.py - CORS disabled)
```python
from flask import Flask, request, jsonify
# ← Missing CORS import

app = Flask(__name__)
# ← Missing CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    # ... your code
```

### ✅ AFTER (With CORS enabled)
```python
from flask import Flask, request, jsonify
from flask_cors import CORS  # ← ADD THIS LINE

app = Flask(__name__)
CORS(app)  # ← ADD THIS LINE

@app.route('/predict', methods=['POST'])
def predict():
    # ... your code (no changes needed here)
```

**That's it! Just 2 lines.**

---

## 🟣 Gemini FastAPI

### ❌ BEFORE (Your current app.py - CORS disabled)
```python
from fastapi import FastAPI, Request
from google import genai
from google.genai import types
# ← Missing CORS import

app = FastAPI()
# ← Missing CORS middleware

@app.post("/detect_hate")
async def detect_hate(request: Request):
    # ... your code
```

### ✅ AFTER (With CORS enabled)
```python
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware  # ← ADD THIS LINE
from google import genai
from google.genai import types

app = FastAPI()

# ← ADD THIS ENTIRE BLOCK (5 lines)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/detect_hate")
async def detect_hate(request: Request):
    # ... your code (no changes needed here)
```

**That's it! 1 import + 5 lines of middleware.**

---

## 📝 Copy-Paste Commands

### For TensorFlow EC2 (54.205.124.174)

```bash
# 1. SSH into EC2
ssh -i your-key.pem ec2-user@54.205.124.174

# 2. Install flask-cors
pip3 install flask-cors

# 3. Edit app.py (add the 2 lines shown above)
nano app.py

# 4. Restart Flask
pkill -f "python3 app.py"
nohup python3 app.py > flask.log 2>&1 &

# 5. Verify it's running
curl http://localhost:5000/
```

### For Gemini EC2 (54.234.84.98)

```bash
# 1. SSH into EC2
ssh -i your-key.pem ec2-user@54.234.84.98

# 2. Edit app.py (add the 1 import + 5 middleware lines shown above)
nano app.py

# 3. Restart FastAPI
pkill -f "uvicorn"
nohup uvicorn app:app --host 0.0.0.0 --port 8000 > gemini.log 2>&1 &

# 4. Verify it's running
curl http://localhost:8000/
```

---

## 🧪 Quick Test (After applying fixes)

### From PowerShell on your local machine:

```powershell
# Test TensorFlow
Invoke-RestMethod -Uri "http://54.205.124.174:5000/" -Method GET

# Test Gemini
Invoke-RestMethod -Uri "http://54.234.84.98:8000/" -Method GET
```

**Expected output for both:**
```json
{ "status": "... is running", "cors_enabled": true }
```

If you see `"cors_enabled": true`, **you're done!** ✅

---

## 🎯 What This Does

### Without CORS (Current state):
```
Browser → [X BLOCKED by CORS] → EC2 API
Terminal → [✓ Works] → EC2 API
```

**Result:** API works in terminal but fails in browser

### With CORS (After fix):
```
Browser → [✓ Allowed by CORS] → EC2 API
Terminal → [✓ Works] → EC2 API
```

**Result:** API works everywhere! 🎉

---

## 🚀 Final Test in Your Frontend

After applying CORS fixes to both APIs:

1. **Refresh your browser** at `http://localhost:3000/analyze`
2. **Clear cache** if needed (Ctrl+Shift+Del)
3. **Enter test text:** "I hate you"
4. **Click "Analyze Text"**

### ✅ Success looks like:
```
┌──────────────────────────────────────────────┐
│  [Both Models] [TensorFlow] [Gemini AI]      │
├──────────────────────┬───────────────────────┤
│ 🔵 TensorFlow LSTM   │ 🟣 Gemini AI          │
│ Classification: 🚫   │ Classification: 🚫    │
│ Hate Speech          │ Hate Speech           │
│ Confidence: 85%      │ Confidence: 95%       │
│ ────────────────     │ ────────────────      │
└──────────────────────┴───────────────────────┘

📊 Model Comparison
Both models agree on classification ✅
```

### ❌ If still broken:
- Check browser console (F12) for errors
- Verify both APIs restarted after adding CORS
- Check security groups allow ports 5000 and 8000
- Verify apps are running on 0.0.0.0 not 127.0.0.1

---

## 🔍 How to Check If CORS is Really Enabled

### Method 1: Browser Console Test
Press F12 in browser, run:
```javascript
fetch('http://54.205.124.174:5000/')
  .then(r => r.json())
  .then(d => console.log('✅ CORS works:', d))
  .catch(e => console.log('❌ CORS broken:', e))
```

### Method 2: Check Response Headers
```bash
curl -i http://54.205.124.174:5000/
```

Look for:
```
Access-Control-Allow-Origin: *
```

If you see this header, CORS is enabled! ✅

---

## 📌 Remember

**You only need to add:**
- **TensorFlow:** 2 lines (1 import + 1 CORS call)
- **Gemini:** 6 lines (1 import + 5 middleware lines)

**Then restart both apps and you're done!** 🎉
