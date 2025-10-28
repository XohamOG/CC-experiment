"""
Gemini FastAPI with CORS Enabled
Copy this entire file to your Gemini EC2 instance
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware  # ← CORS IMPORT
from google import genai
from google.genai import types

app = FastAPI(title="Gemini Hate Speech Detection API")

# ← ENABLE CORS - This fixes the browser error!
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins - for development
    # For production, use: allow_origins=["http://yourdomain.com"]
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# 🧠 Initialize Gemini client
# ⚠️ IMPORTANT: Replace with your actual Gemini API key
client = genai.Client(api_key="YOUR_GEMINI_API_KEY_HERE")

# ✅ Recommended model for classification
MODEL = "gemma-3n-e2b-it"


@app.post("/detect_hate")
async def detect_hate(request: Request):
    """
    Endpoint: POST /detect_hate
    Request: { "text": "some text to analyze" }
    Response: { "input": "...", "classification": "Hate Speech" | "Not Hate Speech" }
    """
    try:
        data = await request.json()
        text = data.get("text", "").strip()

        if not text:
            return {"error": "Empty input text"}

        # 🧩 Strict classification prompt
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

        # ⚙ Config for generation (temperature=0 → more deterministic)
        config = types.GenerateContentConfig(temperature=0.0)

        # 🔁 Generate model response
        result_text = ""
        for chunk in client.models.generate_content_stream(
            model=MODEL, contents=contents, config=config
        ):
            if chunk.text:
                result_text += chunk.text

        result_text = result_text.strip()

        # ✅ Parse binary classification
        if "hate" in result_text.lower() and "not" not in result_text.lower():
            label = "Hate Speech"
        else:
            label = "Not Hate Speech"

        return {
            "input": text,
            "classification": label
        }
        
    except Exception as e:
        print(f"Error in detection: {str(e)}")
        return {"error": f"Internal server error: {str(e)}"}


@app.get("/")
async def health():
    """Health check endpoint"""
    return {
        "status": "Gemini API is running",
        "cors_enabled": True,
        "endpoint": "/detect_hate",
        "method": "POST",
        "model": MODEL
    }


@app.get("/test")
async def test():
    """Quick test endpoint to verify CORS"""
    return {
        "message": "CORS is working!",
        "cors_enabled": True
    }


# To run this app:
# uvicorn app:app --host 0.0.0.0 --port 8000
# Or with auto-reload for development:
# uvicorn app:app --host 0.0.0.0 --port 8000 --reload

if __name__ == "__main__":
    import uvicorn
    print("=" * 50)
    print("🟣 Gemini FastAPI Starting...")
    print("=" * 50)
    print("✅ CORS: Enabled")
    print("🌐 Host: 0.0.0.0 (accessible externally)")
    print("🔌 Port: 8000")
    print("📍 Endpoint: POST /detect_hate")
    print("💚 Health: GET /")
    print("=" * 50)
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
