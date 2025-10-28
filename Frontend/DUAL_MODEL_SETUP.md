# Dual Model Setup - TensorFlow + Gemini

## Overview
The Analyze page now supports **two EC2-hosted models running in parallel** with side-by-side comparison:

### Models
1. **TensorFlow LSTM Model** (🔵)
   - Endpoint: `http://54.205.124.174:5000/predict`
   - Request: `POST { "text": "..." }`
   - Response: `{ "input_text": "...", "prediction": "Hate Speech" | "Normal", "confidence": 0.95 }`

2. **Gemini AI Model** (🟣)
   - Endpoint: `http://54.234.84.98:8000/detect_hate` ✅ **CONFIGURED**
   - EC2 Public IP: `54.234.84.98`
   - EC2 Private IP: `172.31.22.219`
   - Request: `POST { "text": "..." }`
   - Response: `{ "input": "...", "classification": "Hate Speech" | "Not Hate Speech" }`

## ✅ Current Configuration (Ready to Use)

Both models are now configured and ready! No further changes needed.

```javascript
const MODEL_API_ENDPOINTS = {
  tensorflow: {
    name: "TensorFlow LSTM Model",
    url: "http://54.205.124.174:5000/predict",
    description: "Advanced LSTM-based hate speech detection"
  },
  gemini: {
    name: "Gemini AI Model",
    url: "http://54.234.84.98:8000/detect_hate", // ✅ CONFIGURED
    description: "Gemini-powered hate speech analysis"
  }
};
```

## API Response Transformation

### TensorFlow Response → Common Format
```javascript
// TensorFlow returns:
{ "input_text": "...", "prediction": "Hate Speech", "confidence": 0.95 }

// Transformed to:
{
  success: true,
  model: "tensorflow",
  prediction: "hate_speech",
  is_hate_speech: true,
  confidence: 0.95
}
```

### Gemini Response → Common Format
```javascript
// Gemini returns:
{ "input": "...", "classification": "Hate Speech" }

// Transformed to:
{
  success: true,
  model: "gemini",
  prediction: "hate_speech",
  is_hate_speech: true,
  confidence: 0.95, // Default since Gemini doesn't return confidence
  classification: "Hate Speech"
}
```

## How to Update Gemini Endpoint (If Needed in Future)

```javascript
// Line ~9-22
const MODEL_API_ENDPOINTS = {
  tensorflow: {
    name: "TensorFlow LSTM Model",
    url: "http://54.205.124.174:5000/predict",
    description: "Advanced LSTM-based hate speech detection"
  },
  gemini: {
    name: "Gemini AI Model",
    url: "http://YOUR_GEMINI_EC2_IP:PORT/predict", // <-- UPDATE THIS
    description: "Gemini-powered hate speech analysis"
  }
};
```

### If Gemini Response Format is Different

Update the `analyzeGemini()` function around line ~82-97 to transform the response:

```javascript
// Transform to common format (adjust based on actual Gemini response)
return {
  success: true,
  model: "gemini",
  prediction: result.prediction,           // Update field names
  is_hate_speech: result.is_hate_speech,   // Update field names
  confidence: result.confidence,           // Update field names
  raw_response: result
};
```

## Features

### 1. Parallel API Calls
- Both models are called **simultaneously** using `Promise.all()`
- Results display independently - no blocking if one fails

### 2. Tab Views
- **Both Models**: Side-by-side comparison (default)
- **TensorFlow**: Shows only TensorFlow results
- **Gemini AI**: Shows only Gemini results

### 3. Comparison Panel
When both models return results in "Both Models" view:
- ✅ Agreement indicator if predictions match
- ⚠️ Warning if predictions differ
- Confidence scores displayed side-by-side

### 4. Error Handling
- Each model shows its own error card if API fails
- Gemini shows "not yet configured" message until URL is updated
- TensorFlow continues working independently

## UI Layout

```
┌─────────────────────────────────────────────┐
│  [Both Models] [TensorFlow] [Gemini AI]     │  <- Tabs
└─────────────────────────────────────────────┘

┌──────────────────────┬──────────────────────┐
│  🔵 TensorFlow LSTM  │  🟣 Gemini AI        │
│  Classification: ✅  │  Classification: ✅  │
│  Confidence: 92.5%   │  Confidence: 88.3%   │
│  ────────────────    │  ────────────────    │
└──────────────────────┴──────────────────────┘

┌─────────────────────────────────────────────┐
│  📊 Model Comparison                        │
│  ✅ Both models agree on classification     │
└─────────────────────────────────────────────┘
```

## Testing

### With Only TensorFlow (Current State)
```javascript
// Input: "I hate you"
// Result: Gemini shows "not yet configured" error, TensorFlow shows results
```

### After Gemini is Configured
```javascript
// Input: "I hate you"
// Result: Both models show results side-by-side
```

## Key Files Modified
- `frontend/src/pages/Analyze.jsx`: Main dual-model logic
  - `MODEL_API_ENDPOINTS`: Endpoint configuration
  - `analyzeTensorFlow()`: TensorFlow API handler
  - `analyzeGemini()`: Gemini API handler  
  - `analyzeText()`: Orchestrates parallel calls
  - `ModelResultCard`: Reusable result display component

## Advantages
✅ **Easy to update**: Change one URL, no other code changes needed  
✅ **Resilient**: Each model works independently  
✅ **Comparable**: Side-by-side view for easy comparison  
✅ **Scalable**: Can add more models with similar pattern
