# 🔧 CORS Fix for Gemini FastAPI

## Problem
API works in terminal but fails in browser with "Failed to fetch" error.

**Cause:** FastAPI needs CORS middleware to allow browser requests.

---

## Solution: Add CORS Middleware

### Update your app.py

```python
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware  # ← ADD THIS
from google import genai
from google.genai import types

app = FastAPI()

# ← ADD THIS ENTIRE BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (for development)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Initialize Gemini client
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

---

## Complete Fixed app.py (Copy-Paste Ready)

```python
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types

app = FastAPI()

# ✅ Enable CORS for browser access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production: ["http://yourdomain.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 Initialize Gemini client (Replace with your actual API key)
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

# Run with: uvicorn app:app --host 0.0.0.0 --port 8000
```

---

## Restart FastAPI App

```bash
# Stop current FastAPI app (Ctrl+C)

# Restart with CORS enabled
uvicorn app:app --host 0.0.0.0 --port 8000

# Or if using nohup
pkill -f "uvicorn"
nohup uvicorn app:app --host 0.0.0.0 --port 8000 > gemini.log 2>&1 &
```

---

## Verify CORS is Working

### Test from Browser Console
Open `http://localhost:3000`, press F12, and run:

```javascript
fetch('http://54.234.84.98:8000/detect_hate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: 'I hate you' })
})
.then(r => r.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));
```

Expected output:
```json
{
  "input": "I hate you",
  "classification": "Hate Speech"
}
```

---

## Production Configuration (More Secure)

For production, restrict origins to your actual domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://yourdomain.com"  # Your production domain
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
```

---

## Common Issues

### 1. CORS middleware not imported
```bash
# CORSMiddleware is built into FastAPI, no extra install needed
from fastapi.middleware.cors import CORSMiddleware
```

### 2. Still getting CORS error
- Restart FastAPI completely
- Check app is running on 0.0.0.0 (not 127.0.0.1)
- Clear browser cache

### 3. uvicorn not found
```bash
pip3 install uvicorn
```

---

## After Applying Fix

Your browser console should show:
```
✅ Gemini result: { success: true, classification: "Hate Speech", confidence: 0.95 }
```

Instead of:
```
❌ CORS Error: Gemini API needs to enable CORS
```

---

## Quick Checklist

- [ ] Added `from fastapi.middleware.cors import CORSMiddleware`
- [ ] Added `app.add_middleware(CORSMiddleware, ...)` block
- [ ] Restarted FastAPI app
- [ ] Tested in browser console
- [ ] Frontend shows results ✅
