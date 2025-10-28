# Testing Guide - Dual Model Hate Speech Detection

## Quick Start
1. **Start Frontend**: `npm run dev` in `frontend/` folder
2. **Open Browser**: Navigate to `http://localhost:3000/analyze`
3. **Test Both Models**: Enter text and click "Analyze Text"

---

## Test Cases

### ✅ Test 1: Normal Speech
**Input Text:**
```
Hello, how are you today? I hope you're having a great day!
```

**Expected Results:**
- 🔵 **TensorFlow**: Classification = "✅ Normal" (High confidence)
- 🟣 **Gemini**: Classification = "✅ Normal"
- 📊 **Comparison**: Both models should agree ✅

---

### ⚠️ Test 2: Hate Speech
**Input Text:**
```
I hate you and all people like you
```

**Expected Results:**
- 🔵 **TensorFlow**: Classification = "🚫 Hate Speech" (High confidence)
- 🟣 **Gemini**: Classification = "🚫 Hate Speech"
- 📊 **Comparison**: Both models should agree ✅

---

### 🧪 Test 3: Ambiguous Text
**Input Text:**
```
I really don't like this situation at all
```

**Expected Results:**
- Models may disagree (⚠️ warning shown)
- This tests the comparison feature

---

## Manual API Testing

### Test TensorFlow API (cURL)
```bash
curl -X POST http://54.205.124.174:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "I hate you"}'
```

**Expected Response:**
```json
{
  "input_text": "I hate you",
  "prediction": "Hate Speech",
  "confidence": 0.95
}
```

---

### Test Gemini API (cURL)
```bash
curl -X POST http://54.234.84.98:8000/detect_hate \
  -H "Content-Type: application/json" \
  -d '{"text": "I hate you"}'
```

**Expected Response:**
```json
{
  "input": "I hate you",
  "classification": "Hate Speech"
}
```

---

## Testing with PowerShell

### TensorFlow API
```powershell
$body = @{ text = "I hate you" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://54.205.124.174:5000/predict" -Method POST -Body $body -ContentType "application/json"
```

### Gemini API
```powershell
$body = @{ text = "I hate you" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://54.234.84.98:8000/detect_hate" -Method POST -Body $body -ContentType "application/json"
```

---

## UI Testing Checklist

### Basic Functionality
- [ ] Page loads without errors
- [ ] Three tabs are visible: "Both Models", "TensorFlow", "Gemini AI"
- [ ] Text input field is functional
- [ ] "Analyze Text" button is enabled when text is entered

### Model Results
- [ ] Both model cards display after analysis
- [ ] TensorFlow card shows blue icon 🔵
- [ ] Gemini card shows purple icon 🟣
- [ ] Confidence bars animate smoothly
- [ ] Classification labels are correct (✅ or 🚫)

### Tab Switching
- [ ] "Both Models" tab shows side-by-side cards
- [ ] "TensorFlow" tab shows only TensorFlow card
- [ ] "Gemini AI" tab shows only Gemini card
- [ ] Active tab is highlighted

### Comparison Panel
- [ ] Appears when both models return results in "Both Models" view
- [ ] Shows ✅ when models agree
- [ ] Shows ⚠️ when models disagree
- [ ] Displays confidence percentages correctly

### Error Handling
- [ ] Empty input shows error message
- [ ] Network errors display in error cards
- [ ] One model can fail while the other succeeds

---

## Browser Console Testing

Open DevTools (F12) and check:

```javascript
// Should see these logs after clicking "Analyze Text":
// "Analyzing text with TensorFlow..."
// "TensorFlow result: { success: true, ... }"
// "Analyzing text with Gemini..."
// "Gemini result: { success: true, ... }"
```

---

## Common Issues & Solutions

### Issue: "Cannot connect to API"
**Solution:** Check if EC2 instances are running and security groups allow inbound traffic on ports 5000 (TensorFlow) and 8000 (Gemini)

### Issue: CORS Error
**Solution:** Ensure Flask/FastAPI apps have CORS enabled:
```python
# Flask (TensorFlow)
from flask_cors import CORS
CORS(app)

# FastAPI (Gemini)
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"])
```

### Issue: Gemini shows "Empty input text" error
**Solution:** Check request body format - must be `{ "text": "..." }` not `{ "input": "..." }`

### Issue: Results not displaying
**Solution:** Check browser console for errors, verify API response format matches expected structure

---

## Sample Test Texts

### Normal Speech Examples
```
- "What a beautiful day!"
- "I love learning new things"
- "Thank you for your help"
- "This is an interesting project"
```

### Hate Speech Examples
```
- "I hate all [group] people"
- "You should die"
- "Go back to your country"
- "[Slur] are the worst"
```

### Edge Cases
```
- "" (empty string - should show error)
- "hate" (single word - context matters)
- "I hate Mondays" (not hate speech)
- Very long text (500+ characters)
```

---

## Performance Testing

### Response Time Expectations
- **TensorFlow**: < 2 seconds
- **Gemini**: < 3 seconds (API calls are parallel, so total ≈ max of both)

### Load Testing
```bash
# Send 10 requests rapidly
for i in {1..10}; do
  curl -X POST http://54.205.124.174:5000/predict \
    -H "Content-Type: application/json" \
    -d '{"text": "test"}' &
done
```

---

## Deployment Verification

Before going live, verify:
- [x] TensorFlow EC2 running on `54.205.124.174:5000`
- [x] Gemini EC2 running on `54.234.84.98:8000`
- [x] Security groups configured for HTTP traffic
- [x] Frontend deployed and accessible
- [x] Both APIs return correct response formats
- [x] Error handling works for failed API calls

---

## Next Steps After Testing
1. ✅ Test all sample inputs
2. ✅ Verify both models return results
3. ✅ Check comparison panel shows agreement/disagreement
4. ✅ Test error scenarios (disconnect network, etc.)
5. ✅ Verify tab switching works smoothly
6. 🚀 Ready for production!
