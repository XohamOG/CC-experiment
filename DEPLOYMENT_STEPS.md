# 🚀 Quick Deployment Guide

## Step-by-Step Fix for Both APIs

---

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- [ ] SSH key (.pem file) to access both EC2 instances
- [ ] Both EC2 instances are running
- [ ] Security groups allow ports 5000 and 8000

---

## 🔵 Fix TensorFlow API (5 minutes)

### Step 1: SSH into TensorFlow EC2
```bash
ssh -i your-key.pem ec2-user@54.205.124.174
```

### Step 2: Install flask-cors
```bash
pip3 install flask-cors
```

### Step 3: Update your app.py
**Option A - Quick Fix (Add 2 lines to existing file):**
```bash
nano app.py  # or vim app.py
```

Add these lines at the top:
```python
from flask_cors import CORS  # Add after other imports
CORS(app)  # Add right after app = Flask(__name__)
```

**Option B - Use the complete file I created:**

I've created `tensorflow_api_with_cors.py` with CORS already enabled. You can:
1. Copy it to your EC2 instance
2. Replace your existing app.py with it
3. Update the model loading section with your actual model

### Step 4: Restart the Flask app
```bash
# If running in foreground, stop with Ctrl+C, then:
python3 app.py

# If running with nohup:
pkill -f "python3 app.py"
nohup python3 app.py > flask.log 2>&1 &
```

### Step 5: Test it works
```bash
# From inside EC2:
curl http://localhost:5000/

# From your local machine (PowerShell):
curl http://54.205.124.174:5000/
```

You should see: `{"status": "TensorFlow API is running", "cors_enabled": true}`

---

## 🟣 Fix Gemini API (5 minutes)

### Step 1: SSH into Gemini EC2
```bash
ssh -i your-key.pem ec2-user@54.234.84.98
```

### Step 2: Update your app.py
**Option A - Quick Fix (Add CORS middleware to existing file):**
```bash
nano app.py  # or vim app.py
```

Add these lines:
```python
from fastapi.middleware.cors import CORSMiddleware  # Add at top with imports

# Add this block right after app = FastAPI():
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Option B - Use the complete file I created:**

I've created `gemini_api_with_cors.py` with CORS already enabled. You can:
1. Copy it to your EC2 instance
2. Replace your existing app.py with it
3. **IMPORTANT:** Add your actual Gemini API key

### Step 3: Update Gemini API Key
```python
# Replace this line in app.py:
client = genai.Client(api_key="YOUR_GEMINI_API_KEY_HERE")

# With your actual key:
client = genai.Client(api_key="your-actual-api-key-123456")
```

### Step 4: Restart FastAPI
```bash
# If running in foreground, stop with Ctrl+C, then:
uvicorn app:app --host 0.0.0.0 --port 8000

# If running with nohup:
pkill -f "uvicorn"
nohup uvicorn app:app --host 0.0.0.0 --port 8000 > gemini.log 2>&1 &
```

### Step 5: Test it works
```bash
# From inside EC2:
curl http://localhost:8000/

# From your local machine (PowerShell):
curl http://54.234.84.98:8000/
```

You should see: `{"status": "Gemini API is running", "cors_enabled": true}`

---

## ✅ Verify CORS is Fixed

### Test from PowerShell (Your Local Machine)

**Test TensorFlow:**
```powershell
$body = @{ text = "I hate you" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://54.205.124.174:5000/predict" -Method POST -Body $body -ContentType "application/json"
```

Expected response:
```json
{
  "input_text": "I hate you",
  "prediction": "Hate Speech",
  "confidence": 0.95
}
```

**Test Gemini:**
```powershell
$body = @{ text = "I hate you" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://54.234.84.98:8000/detect_hate" -Method POST -Body $body -ContentType "application/json"
```

Expected response:
```json
{
  "input": "I hate you",
  "classification": "Hate Speech"
}
```

---

## 🌐 Test in Browser

### Open Browser Console (F12) and run:

**Test TensorFlow:**
```javascript
fetch('http://54.205.124.174:5000/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'I hate you' })
})
.then(r => r.json())
.then(data => console.log('✅ TensorFlow CORS Fixed:', data))
.catch(err => console.error('❌ Still broken:', err));
```

**Test Gemini:**
```javascript
fetch('http://54.234.84.98:8000/detect_hate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'I hate you' })
})
.then(r => r.json())
.then(data => console.log('✅ Gemini CORS Fixed:', data))
.catch(err => console.error('❌ Still broken:', err));
```

If you see `✅` messages with data, **CORS is working!**

---

## 🎯 Test Your Frontend

1. **Make sure dev server is running:**
   ```bash
   cd "D:\CC experiment\frontend"
   npm run dev
   ```

2. **Open browser:** `http://localhost:3000/analyze`

3. **Enter test text:** "I hate you"

4. **Click "Analyze Text"**

5. **Expected result:**
   ```
   ┌──────────────────────┬──────────────────────┐
   │ 🔵 TensorFlow LSTM   │ 🟣 Gemini AI         │
   │ Classification: 🚫   │ Classification: 🚫   │
   │ Hate Speech          │ Hate Speech          │
   │ Confidence: 95%      │ Confidence: 95%      │
   └──────────────────────┴──────────────────────┘
   
   📊 Both models agree ✅
   ```

---

## 🔧 Troubleshooting

### Problem: "Connection refused" or "Cannot connect"

**Solution:** Check if apps are running
```bash
# Inside each EC2:
netstat -tuln | grep 5000  # TensorFlow
netstat -tuln | grep 8000  # Gemini

# Should show: 0.0.0.0:5000 or 0.0.0.0:8000 in LISTEN state
```

### Problem: Still getting CORS error after fix

**Solution:** Make sure you restarted the apps
```bash
# TensorFlow EC2:
pkill -f "python3 app.py"
nohup python3 app.py > flask.log 2>&1 &

# Gemini EC2:
pkill -f "uvicorn"
nohup uvicorn app:app --host 0.0.0.0 --port 8000 > gemini.log 2>&1 &
```

### Problem: Security group issues

**AWS Console → EC2 → Security Groups:**

**TensorFlow SG:** Add inbound rule
- Type: Custom TCP
- Port: 5000
- Source: 0.0.0.0/0

**Gemini SG:** Add inbound rule
- Type: Custom TCP
- Port: 8000
- Source: 0.0.0.0/0

### Problem: Flask CORS not working

**Make sure flask-cors is installed:**
```bash
pip3 install flask-cors
pip3 list | grep cors  # Should show: Flask-Cors
```

### Problem: Gemini API key error

**Update the API key in app.py:**
```python
client = genai.Client(api_key="YOUR_ACTUAL_KEY_HERE")
```

---

## 📁 Files I Created for You

1. **`tensorflow_api_with_cors.py`** - Complete Flask app with CORS
2. **`gemini_api_with_cors.py`** - Complete FastAPI app with CORS
3. **`CORS_QUICK_FIX.md`** - Quick fix summary
4. **`CORS_FIX_TENSORFLOW.md`** - Detailed Flask guide
5. **`CORS_FIX_GEMINI.md`** - Detailed FastAPI guide

---

## ⏱️ Time Estimate

- TensorFlow API fix: **5 minutes**
- Gemini API fix: **5 minutes**
- Testing: **5 minutes**
- **Total: 15 minutes**

---

## 🎉 Success Criteria

After completing all steps, you should see:
- ✅ Both APIs respond to `/` health check
- ✅ Both APIs respond to `/predict` and `/detect_hate`
- ✅ No CORS errors in browser console
- ✅ Frontend shows both model results
- ✅ Comparison panel shows agreement/disagreement

---

## 📞 Need Help?

If you're stuck:
1. Check the logs: `tail -f flask.log` or `tail -f gemini.log`
2. Verify security groups in AWS console
3. Make sure apps are running on 0.0.0.0 (not 127.0.0.1)
4. Test with curl first, then browser

**Once CORS is fixed, your dual-model comparison will work perfectly!** 🚀
