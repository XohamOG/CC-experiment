# 🚨 QUICK FIX: CORS Error - API Works in Terminal but Not Browser

## The Problem
✅ API works when testing with PowerShell/curl  
❌ API fails in browser with "Failed to fetch" or CORS error

**Why?** Browsers block cross-origin requests for security. Your EC2 APIs need to explicitly allow requests from your frontend.

---

## The Solution (Super Simple!)

### For TensorFlow Flask API (Port 5000)

**Step 1:** SSH into your TensorFlow EC2
```bash
ssh -i your-key.pem ec2-user@54.205.124.174
```

**Step 2:** Install flask-cors
```bash
pip3 install flask-cors
```

**Step 3:** Edit app.py - Add 2 lines at the top:
```python
from flask import Flask, request, jsonify
from flask_cors import CORS  # ← LINE 1: Add this import

app = Flask(__name__)
CORS(app)  # ← LINE 2: Add this one line

# ... rest of your existing code stays the same
```

**Step 4:** Restart Flask
```bash
# Stop the app (Ctrl+C if running)
# Then restart:
python3 app.py

# Or if using nohup:
pkill -f "python3 app.py"
nohup python3 app.py > flask.log 2>&1 &
```

---

### For Gemini FastAPI (Port 8000)

**Step 1:** SSH into your Gemini EC2
```bash
ssh -i your-key.pem ec2-user@54.234.84.98
```

**Step 2:** Edit app.py - Add CORS middleware:
```python
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware  # ← Add this import
from google import genai
from google.genai import types

app = FastAPI()

# ← Add this entire block (5 lines)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ... rest of your existing code stays the same
```

**Step 3:** Restart FastAPI
```bash
# Stop the app (Ctrl+C if running)
# Then restart:
uvicorn app:app --host 0.0.0.0 --port 8000

# Or if using nohup:
pkill -f "uvicorn"
nohup uvicorn app:app --host 0.0.0.0 --port 8000 > gemini.log 2>&1 &
```

---

## Test If It's Fixed

### From PowerShell (on your local machine):

**Test TensorFlow:**
```powershell
$body = @{ text = "I hate you" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://54.205.124.174:5000/predict" -Method POST -Body $body -ContentType "application/json"
```

**Test Gemini:**
```powershell
$body = @{ text = "I hate you" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://54.234.84.98:8000/detect_hate" -Method POST -Body $body -ContentType "application/json"
```

### From Browser Console (F12):

**Test TensorFlow:**
```javascript
fetch('http://54.205.124.174:5000/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'test' })
}).then(r => r.json()).then(console.log)
```

**Test Gemini:**
```javascript
fetch('http://54.234.84.98:8000/detect_hate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'test' })
}).then(r => r.json()).then(console.log)
```

If you see JSON responses (not errors), **CORS is fixed!** ✅

---

## Now Test Your Frontend

1. Go to `http://localhost:3000/analyze`
2. Enter: "I hate you"
3. Click "Analyze Text"
4. **You should see both model results! 🎉**

---

## Still Not Working?

### Check Security Groups (AWS Console)
Both EC2 instances need these inbound rules:

**TensorFlow EC2 (54.205.124.174):**
- Type: Custom TCP
- Port: 5000
- Source: 0.0.0.0/0

**Gemini EC2 (54.234.84.98):**
- Type: Custom TCP
- Port: 8000
- Source: 0.0.0.0/0

### Check Apps are Running
```bash
# Inside each EC2 instance:
netstat -tuln | grep 5000  # For TensorFlow
netstat -tuln | grep 8000  # For Gemini

# Should show: 0.0.0.0:5000 (or 8000) in LISTEN state
```

### Check Logs
```bash
# Flask
tail -f flask.log

# FastAPI
tail -f gemini.log
```

---

## Summary

**The Problem:** Browser security blocks cross-origin requests  
**The Fix:** Enable CORS in both APIs (2 lines each)  
**Time:** 2 minutes per API  
**Result:** Frontend works perfectly! 🚀

**Detailed guides:**
- `CORS_FIX_TENSORFLOW.md` - Full Flask CORS guide
- `CORS_FIX_GEMINI.md` - Full FastAPI CORS guide
