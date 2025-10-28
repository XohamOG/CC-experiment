# EC2 Setup Guide - Deploy Both Models

## Current Status ⚠️

**Both APIs are currently unreachable.** Follow this guide to get them running.

### EC2 Instances

1. **TensorFlow Model EC2**
   - Public IP: `54.205.124.174`
   - Port: `5000`
   - Endpoint: `http://54.205.124.174:5000/predict`
   - Status: ⚠️ Not accessible

2. **Gemini Model EC2**
   - Public IP: `54.234.84.98`
   - Private IP: `172.31.22.219`
   - Port: `8000`
   - Endpoint: `http://54.234.84.98:8000/detect_hate`
   - Status: ⚠️ Not accessible

---

## Step 1: Configure Security Groups

### For TensorFlow EC2 (Port 5000)
```bash
# In AWS Console → EC2 → Security Groups
# Add Inbound Rule:
Type: Custom TCP
Port: 5000
Source: 0.0.0.0/0 (or your IP for security)
Description: TensorFlow Flask API
```

### For Gemini EC2 (Port 8000)
```bash
# In AWS Console → EC2 → Security Groups
# Add Inbound Rule:
Type: Custom TCP
Port: 8000
Source: 0.0.0.0/0 (or your IP for security)
Description: Gemini FastAPI
```

---

## Step 2: Deploy TensorFlow Model

### SSH into TensorFlow EC2
```bash
ssh -i your-key.pem ec2-user@54.205.124.174
```

### Install Dependencies
```bash
# Update system
sudo yum update -y

# Install Python 3
sudo yum install python3 python3-pip -y

# Install required packages
pip3 install flask flask-cors tensorflow numpy pandas
```

### Create Flask App (app.py)
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# Load your model
model = tf.keras.models.load_model('path/to/your/model.h5')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'Empty text'}), 400
        
        # Preprocess text and make prediction
        # prediction = model.predict(preprocessed_text)
        # confidence = float(np.max(prediction))
        # is_hate = prediction[0][1] > 0.5
        
        # Example response (replace with actual prediction):
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

### Run Flask App
```bash
# Option 1: Run directly (stops when you close SSH)
python3 app.py

# Option 2: Run in background (continues after closing SSH)
nohup python3 app.py > flask.log 2>&1 &

# Check if running
curl http://localhost:5000/

# Test prediction
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "I hate you"}'
```

---

## Step 3: Deploy Gemini Model

### SSH into Gemini EC2
```bash
ssh -i your-key.pem ec2-user@54.234.84.98
```

### Install Dependencies
```bash
# Update system
sudo yum update -y

# Install Python 3
sudo yum install python3 python3-pip -y

# Install FastAPI and Gemini SDK
pip3 install fastapi uvicorn google-generativeai
```

### Create FastAPI App (app.py)
```python
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Gemini client (REPLACE WITH YOUR ACTUAL API KEY)
client = genai.Client(api_key="YOUR_GEMINI_API_KEY")

MODEL = "gemma-3n-e2b-it"

@app.post("/detect_hate")
async def detect_hate(request: Request):
    data = await request.json()
    text = data.get("text", "").strip()

    if not text:
        return {"error": "Empty input text"}

    prompt = f"""
You are a content moderation system.
Determine if the following text contains hate speech.

Definition:
Hate Speech includes insults, slurs, or attacks on people based on race, religion,
gender, sexuality, nationality, or disability.

Respond with exactly one of the following:
- Hate Speech
- Not Hate Speech

Text: "{text}"
"""

    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt)],
        ),
    ]

    config = types.GenerateContentConfig(temperature=0.0)

    result_text = ""
    for chunk in client.models.generate_content_stream(
        model=MODEL, contents=contents, config=config
    ):
        if chunk.text:
            result_text += chunk.text

    result_text = result_text.strip()

    if "hate" in result_text.lower() and "not" not in result_text.lower():
        label = "Hate Speech"
    else:
        label = "Not Hate Speech"

    return {"input": text, "classification": label}

@app.get("/")
async def health():
    return {"status": "Gemini API is running"}
```

### Run FastAPI App
```bash
# Option 1: Run directly (stops when you close SSH)
uvicorn app:app --host 0.0.0.0 --port 8000

# Option 2: Run in background (continues after closing SSH)
nohup uvicorn app:app --host 0.0.0.0 --port 8000 > gemini.log 2>&1 &

# Check if running
curl http://localhost:8000/

# Test prediction
curl -X POST http://localhost:8000/detect_hate \
  -H "Content-Type: application/json" \
  -d '{"text": "I hate you"}'
```

---

## Step 4: Verify APIs are Running

### Test from Your Local Machine

#### TensorFlow API
```powershell
# PowerShell
$body = @{ text = "I hate you" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://54.205.124.174:5000/predict" -Method POST -Body $body -ContentType "application/json"
```

#### Gemini API
```powershell
# PowerShell
$body = @{ text = "I hate you" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://54.234.84.98:8000/detect_hate" -Method POST -Body $body -ContentType "application/json"
```

---

## Step 5: Keep Services Running (Production Setup)

### Using systemd (Recommended)

#### TensorFlow Service
```bash
# Create service file
sudo nano /etc/systemd/system/tensorflow-api.service
```

```ini
[Unit]
Description=TensorFlow Hate Speech API
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user
ExecStart=/usr/bin/python3 /home/ec2-user/app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable tensorflow-api
sudo systemctl start tensorflow-api
sudo systemctl status tensorflow-api
```

#### Gemini Service
```bash
# Create service file
sudo nano /etc/systemd/system/gemini-api.service
```

```ini
[Unit]
Description=Gemini Hate Speech API
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user
ExecStart=/usr/local/bin/uvicorn app:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable gemini-api
sudo systemctl start gemini-api
sudo systemctl status gemini-api
```

---

## Troubleshooting

### Check if Port is Open
```bash
# From inside EC2
netstat -tuln | grep 5000
netstat -tuln | grep 8000

# Check firewall
sudo iptables -L
```

### View Logs
```bash
# If running with nohup
tail -f flask.log
tail -f gemini.log

# If using systemd
sudo journalctl -u tensorflow-api -f
sudo journalctl -u gemini-api -f
```

### Common Issues

1. **Port Already in Use**
   ```bash
   # Kill existing process
   sudo lsof -i :5000
   sudo kill -9 <PID>
   ```

2. **CORS Errors**
   - Ensure CORS is enabled in Flask (`flask-cors`) and FastAPI (`CORSMiddleware`)

3. **Connection Timeout**
   - Check Security Group inbound rules
   - Verify EC2 instance is running
   - Check if service is listening on 0.0.0.0 (not 127.0.0.1)

---

## Quick Start Checklist

- [ ] TensorFlow EC2 security group allows port 5000
- [ ] Gemini EC2 security group allows port 8000
- [ ] Both EC2 instances are running
- [ ] Flask app deployed on TensorFlow EC2
- [ ] FastAPI app deployed on Gemini EC2
- [ ] Both services running in background (nohup or systemd)
- [ ] APIs respond to health check (`GET /`)
- [ ] APIs respond to prediction requests
- [ ] Frontend can access both APIs
- [ ] No CORS errors in browser console

---

## Once APIs are Running

Your frontend at `http://localhost:3000/analyze` will automatically:
- ✅ Call both APIs in parallel
- ✅ Display results side-by-side
- ✅ Show comparison panel
- ✅ Handle errors gracefully

**Test URL:** http://localhost:3000/analyze

Enter text like "I hate you" and click "Analyze Text" to see both models in action!
