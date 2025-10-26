import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import WaveCanvas from "@/components/WaveCanvas";
import EnhancedAudioControls from "@/components/EnhancedAudioControls";
import AnimatedButton from "@/components/AnimatedButton";
import EnhancedOrb from "@/components/EnhancedOrb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

const API_BASE_URL = "https://hate-speech-api-dzmg.onrender.com/api";

// Sample hate speech text examples
const SAMPLE_TEXTS = {
  "Hate Speech Example 1": "I hate all those people, they should be eliminated",
  "Hate Speech Example 2": "Those idiots deserve to suffer for what they are", 
  "Normal Text 1": "I love spending time with my family and friends",
  "Normal Text 2": "This is a beautiful day for a walk in the park",
  "Neutral Comment": "The weather forecast shows rain tomorrow afternoon",
};

// Analyze page: Text + Audio input for hate speech detection
export default function Analyze() {
  const { isDark } = useTheme();
  const [inputText, setInputText] = useState("");
  const [hasInput, setHasInput] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [selectedSample, setSelectedSample] = useState("");
  const [inputMode, setInputMode] = useState("text"); // "text" or "audio"
  const navigate = useNavigate();

  // Process text input for hate speech detection
  const analyzeText = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text to analyze");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();

      // Transform API response to match frontend expectations
      if (result.status === "success") {
        const transformedResult = {
          success: true,
          prediction: result.label, // "hate_speech" or "normal"
          is_hate_speech: result.prediction === 1,
          probabilities: {
            normal: result.prediction === 0 ? result.confidence : (1 - result.confidence),
            hate: result.prediction === 1 ? result.confidence : (1 - result.confidence)
          },
          confidence: result.confidence,
          text: result.text
        };
        setResults(transformedResult);
        setHasInput(true);
      } else {
        setError(result.message || "Failed to analyze text");
      }
    } catch (err) {
      console.error("Text analysis error:", err);
      if (err.message.includes("Failed to fetch")) {
        setError("Cannot connect to the hate speech detection API. Please check your internet connection.");
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Process audio file for hate speech detection
  // Note: Current API only supports text input
  // Audio files would need speech-to-text conversion first
  const processAudioFile = async (audioFile) => {
    setIsProcessing(true);
    setError(null);
    setResults(null);

    try {
      // For now, show a message that audio processing requires additional setup
      setError("Audio analysis requires speech-to-text conversion. Please use text input for now, or we can add speech-to-text integration in the future.");
      setIsProcessing(false);
      return;
      
      /* Future implementation with speech-to-text:
      // 1. Convert audio to text using a speech-to-text service
      // 2. Send the transcribed text to the hate speech API
      const formData = new FormData();
      let fileToSend = audioFile;
      if (audioFile instanceof Blob && !(audioFile instanceof File)) {
        fileToSend = new File([audioFile], 'recorded-audio.webm', { 
          type: audioFile.type || 'audio/webm' 
        });
      }
      
      formData.append("audio", fileToSend);
      
      // Send to speech-to-text service first
      const transcriptionResponse = await fetch(`${SPEECH_TO_TEXT_API}`, {
        method: "POST",
        body: formData,
      });
      
      const transcription = await transcriptionResponse.json();
      
      // Then analyze the transcribed text
      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: transcription.text
        }),
      });
      
      // Process response same as text analysis
      */
    } catch (err) {
      console.error("Audio processing error:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSampleSelect = (e) => {
    const sample = e.target.value;
    setSelectedSample(sample);
    if (sample && SAMPLE_TEXTS[sample]) {
      setInputText(SAMPLE_TEXTS[sample]);
      setInputMode("text");
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen relative"
    >
      {/* Enhanced background with orb and waves */}
      <EnhancedOrb
        hue={200}
        hoverIntensity={0.3}
        rotateOnHover={true}
        className="opacity-25"
      />
      <div className="absolute inset-0 pointer-events-none z-10">
        <WaveCanvas className="w-full h-[50vh] md:h-[60vh] opacity-50" />
      </div>

      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-12 pt-24 md:pt-32 space-y-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-3"
        >
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="funky-title text-3xl md:text-5xl"
          >
            🔍 Hate Speech Detection
          </motion.h1>
          <div className="flex flex-wrap items-center gap-2">
            {["Text Analysis", "Audio Analysis", "Cloud Computing", "AI Detection"].map((tag, index) => (
              <motion.span
                key={tag}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.4 + index * 0.1,
                  type: "spring",
                  stiffness: 300,
                }}
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-block rounded-full bg-gradient-to-r from-secondary to-accent/20 text-secondary-foreground text-xs px-3 py-1 cursor-default"
              >
                {tag}
              </motion.span>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-muted-foreground max-w-prose"
          >
            Analyze text or audio for hate speech using advanced AI models deployed on cloud infrastructure.
          </motion.p>
        </motion.header>

        {/* Input Mode Toggle */}
        <div className="flex gap-3 justify-center">
          <AnimatedButton
            onClick={() => setInputMode("text")}
            variant={inputMode === "text" ? "primary" : "secondary"}
            className="flex-1 max-w-xs"
          >
            ✍️ Text Input
          </AnimatedButton>
          <AnimatedButton
            onClick={() => setInputMode("audio")}
            variant={inputMode === "audio" ? "primary" : "secondary"}
            className="flex-1 max-w-xs"
          >
            🎤 Audio Input
          </AnimatedButton>
        </div>

        {/* Main analysis sections */}
        <div className="space-y-8">
          {/* Text Input Section */}
          {inputMode === "text" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">✍️ Enter Text for Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Type or paste the text you want to analyze for hate speech detection.
                  </p>

                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter text here..."
                    className={`w-full min-h-[150px] px-4 py-3 border rounded-lg resize-y ${
                      isDark 
                        ? 'bg-neutral-800 border-neutral-700 text-white placeholder-neutral-500' 
                        : 'bg-white border-neutral-300 text-neutral-900 placeholder-neutral-400'
                    } focus:outline-none focus:ring-2 focus:ring-primary`}
                    disabled={isProcessing}
                  />

                  <div className="flex gap-3">
                    <AnimatedButton
                      onClick={analyzeText}
                      disabled={isProcessing || !inputText.trim()}
                      variant="primary"
                      className="flex-1"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        "Analyze Text"
                      )}
                    </AnimatedButton>
                    
                    <AnimatedButton
                      onClick={() => {
                        setInputText("");
                        setResults(null);
                        setError(null);
                      }}
                      variant="secondary"
                      disabled={isProcessing}
                    >
                      Clear
                    </AnimatedButton>
                  </div>
                </CardContent>
              </Card>

              {/* Test with Sample Data Section */}
              <Card className="border-2 border-secondary/20 mt-6">
                <CardHeader>
                  <CardTitle className="text-xl">🧪 Test with Sample Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Choose from pre-defined text samples to test the detection system
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <select
                      value={selectedSample}
                      onChange={handleSampleSelect}
                      className={`flex-1 px-3 py-2 border rounded-md ${
                        isDark 
                          ? 'bg-neutral-800 border-neutral-700 text-white' 
                          : 'bg-white border-neutral-300'
                      }`}
                      disabled={isProcessing}
                    >
                      <option value="">Select a sample...</option>
                      {Object.keys(SAMPLE_TEXTS).map((sampleName) => (
                        <option key={sampleName} value={sampleName}>
                          {sampleName}
                        </option>
                      ))}
                    </select>

                    <AnimatedButton
                      onClick={analyzeText}
                      disabled={isProcessing || !inputText.trim()}
                      variant="secondary"
                    >
                      Test Sample
                    </AnimatedButton>
                  </div>

                  {selectedSample && SAMPLE_TEXTS[selectedSample] && (
                    <div className={`text-sm p-3 rounded ${
                      isDark ? 'bg-neutral-800' : 'bg-muted/50'
                    }`}>
                      <strong>Sample text:</strong> {SAMPLE_TEXTS[selectedSample]}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Audio Input Section */}
          {inputMode === "audio" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">🎤 Upload or Record Audio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upload an audio file or record audio to analyze speech for hate content. Supported formats: WAV, MP3, FLAC, M4A, OGG
                  </p>

                  <EnhancedAudioControls
                    onAudioReady={(audioFile) => {
                      console.log("Audio file received:", audioFile);
                      processAudioFile(audioFile);
                    }}
                  />

                  {isProcessing && (
                    <div className={`flex items-center gap-2 ${isDark ? 'text-white' : 'text-beige-700'}`}>
                      <div className={`animate-spin w-4 h-4 border-2 ${isDark ? 'border-white' : 'border-beige-600'} border-t-transparent rounded-full`}></div>
                      <span>🔊 Analyzing audio for hate speech...</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${
              isDark 
                ? 'bg-red-900/20 border-red-600 text-red-300' 
                : 'bg-red-100 border-red-300 text-red-700'
            } border p-4 rounded-lg`}
          >
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Results Display */}
        {results && results.success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Prediction Results */}
            <Card className={`${
              results.prediction === "hate" || results.is_hate_speech
                ? isDark 
                  ? 'bg-gradient-to-r from-red-900/30 to-orange-900/30 border-red-700' 
                  : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
                : isDark 
                  ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-700' 
                  : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
            }`}>
              <CardHeader>
                <CardTitle className={`${isDark ? 'text-white' : 'text-neutral-800'} text-xl`}>
                  Detection Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-neutral-900'}`}>
                  Classification:{" "}
                  <span className={(results.prediction === "hate" || results.is_hate_speech) ? 'text-red-500' : 'text-green-500'}>
                    {(results.prediction === "hate" || results.is_hate_speech) ? "🚫 Hate Speech Detected" : "✅ No Hate Speech"}
                  </span>
                </div>

                {/* Confidence Score */}
                {results.probabilities && (
                  <div className="space-y-3">
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-neutral-800'} text-lg`}>
                      Prediction Confidence
                    </h3>
                    {Object.entries(results.probabilities).map(([label, prob]) => (
                      <div key={label} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium capitalize">{label}</span>
                          <span>{(prob * 100).toFixed(2)}%</span>
                        </div>
                        <div className={`w-full ${isDark ? 'bg-neutral-700' : 'bg-neutral-200'} rounded-full h-3`}>
                          <motion.div
                            className={`${label === "hate" ? 'bg-red-500' : 'bg-green-500'} h-3 rounded-full`}
                            initial={{ width: 0 }}
                            animate={{ width: `${prob * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input content display */}
                {inputMode === "text" && inputText && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Analyzed Text:</h4>
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-neutral-800' : 'bg-neutral-100'} text-sm`}>
                      {inputText}
                    </div>
                  </div>
                )}

                {inputMode === "audio" && (
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-neutral-800' : 'bg-neutral-100'} text-sm`}>
                    <strong>Input Type:</strong> Audio file analyzed
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-6"
        >
          <div className="flex gap-3">
            <AnimatedButton
              className="gap-2"
              variant="primary"
              disabled={!results || isProcessing}
              onClick={() => {
                if (results) {
                  navigate("/results", { state: { results, inputMode, inputText } });
                }
              }}
            >
              {isProcessing ? "Processing..." : "View Enhanced Results →"}
            </AnimatedButton>
          </div>

          {!results && !isProcessing && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-muted-foreground mt-3"
            >
              Enter text or upload audio to see detection results.
            </motion.p>
          )}
        </motion.div>
      </section>
    </motion.main>
  );
}