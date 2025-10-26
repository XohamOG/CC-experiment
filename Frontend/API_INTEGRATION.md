# API Integration Guide - Vishwas Netra

## Production API Endpoint
**Base URL:** `https://hate-speech-api-dzmg.onrender.com/api`

## Frontend Configuration

The frontend has been updated to use your deployed Render API instead of localhost.

### Changes Made:

1. **API Base URL Updated** (`src/pages/Analyze.jsx`)
   ```javascript
   const API_BASE_URL = "https://hate-speech-api-dzmg.onrender.com/api";
   ```

2. **Request Format** (matches your API)
   ```javascript
   POST /api/predict
   Content-Type: application/json
   
   Body:
   {
     "text": "Text to analyze"
   }
   ```

3. **Response Handling** (transformed to match frontend UI)
   ```javascript
   API Response:
   {
     "text": "analyzed text",
     "prediction": 0 or 1,
     "label": "normal" or "hate_speech",
     "confidence": 0.95,
     "status": "success"
   }
   
   Transformed for Frontend:
   {
     "success": true,
     "prediction": "hate_speech" or "normal",
     "is_hate_speech": true/false,
     "probabilities": {
       "normal": 0.05,
       "hate": 0.95
     },
     "confidence": 0.95,
     "text": "analyzed text"
   }
   ```

## Available API Endpoints

### 1. Health Check
```
GET https://hate-speech-api-dzmg.onrender.com/health
```
Returns model status and health information.

### 2. Single Text Prediction
```
POST https://hate-speech-api-dzmg.onrender.com/api/predict

Body:
{
  "text": "Your text here"
}

Response:
{
  "text": "Your text here",
  "prediction": 1,
  "label": "hate_speech",
  "confidence": 0.95,
  "status": "success"
}
```

### 3. Batch Prediction
```
POST https://hate-speech-api-dzmg.onrender.com/api/batch-predict

Body:
{
  "texts": ["text 1", "text 2", "text 3"]
}

Response:
{
  "predictions": [
    {
      "text": "text 1",
      "prediction": 0,
      "label": "normal",
      "confidence": 0.88
    },
    // ... more predictions
  ],
  "count": 3,
  "status": "success"
}
```

### 4. API Documentation
```
GET https://hate-speech-api-dzmg.onrender.com/api/docs
```
Returns full API documentation.

## Testing the Integration

### Using PowerShell:
```powershell
# Test normal text
$body = @{ text = "I love this beautiful day" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://hate-speech-api-dzmg.onrender.com/api/predict" -Method POST -Body $body -ContentType "application/json"

# Test hate speech
$body = @{ text = "I hate all those people" } | ConvertTo-Json
Invoke-RestMethod -Uri "https://hate-speech-api-dzmg.onrender.com/api/predict" -Method POST -Body $body -ContentType "application/json"
```

### Using Frontend:
1. Navigate to the Analyze page
2. Switch to "Text Input" mode
3. Enter text or select a sample
4. Click "Analyze Text"
5. View results with confidence scores

## Audio Input Status

⚠️ **Current Status:** Audio analysis is temporarily disabled because the deployed API only accepts text input.

### To Enable Audio in the Future:

You would need to add a speech-to-text service (like Google Speech-to-Text, AWS Transcribe, or AssemblyAI) that:

1. Accepts audio files (WAV, MP3, etc.)
2. Transcribes audio to text
3. Sends transcribed text to your hate speech API

**Implementation Steps:**
```javascript
// 1. Upload audio to speech-to-text service
const transcription = await speechToTextAPI(audioFile);

// 2. Send transcribed text to hate speech API
const response = await fetch(`${API_BASE_URL}/predict`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text: transcription.text })
});
```

## Error Handling

The frontend now handles these error cases:
- Network connectivity issues
- API errors (400, 500, 503)
- Empty or invalid text input
- API timeout or unavailability

Error messages are user-friendly and displayed in the UI.

## CORS Configuration

Your API already has CORS enabled for all origins:
```python
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

This allows the frontend to make requests from any domain.

## Running the Frontend

```powershell
cd "D:/CC experiment/frontend"
npm run dev
```

The frontend will be available at `http://localhost:5173` and will automatically connect to your production API at Render.

## Sample Texts for Testing

The frontend includes these pre-loaded samples:
1. **Hate Speech Example 1:** "I hate all those people, they should be eliminated"
2. **Hate Speech Example 2:** "Those idiots deserve to suffer for what they are"
3. **Normal Text 1:** "I love spending time with my family and friends"
4. **Normal Text 2:** "This is a beautiful day for a walk in the park"
5. **Neutral Comment:** "The weather forecast shows rain tomorrow afternoon"

## Production Considerations

✅ **Completed:**
- API endpoint updated to production URL
- Request/response transformation implemented
- Error handling for production scenarios
- CORS properly configured

⏳ **Future Enhancements:**
- Add speech-to-text for audio analysis
- Implement batch prediction UI
- Add loading indicators for slow API responses (Render free tier may have cold starts)
- Add retry logic for failed requests
- Cache recent predictions

## Notes

- **Cold Start:** Render free tier services may "sleep" after inactivity. First request might be slow (10-30 seconds).
- **Rate Limiting:** Consider adding rate limiting UI feedback if needed.
- **Analytics:** Consider tracking API usage and response times.

---

**Status:** ✅ Ready for production use with text input  
**Last Updated:** October 27, 2025
