import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Mic, MicOff, File, Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import AnimatedButton from './AnimatedButton'

export default function EnhancedAudioControls({ onAudioReady }) {
  const [recording, setRecording] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [audioFile, setAudioFile] = useState(null)
  const [recordingTime, setRecordingTime] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const fileInputRef = useRef(null)
  const recordingIntervalRef = useRef(null)

  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files && files[0]) {
      processAudioFile(files[0])
    }
  }, [])

  const processAudioFile = useCallback((file) => {
    if (!file.type.startsWith('audio/')) {
      alert('Please select an audio file')
      return
    }
    
    // Simulate upload progress
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setAudioFile(file)
          onAudioReady(file, 'upload')
          return 100
        }
        return prev + 10
      })
    }, 100)
  }, [onAudioReady])

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0]
    if (file) {
      processAudioFile(file)
    }
  }, [processAudioFile])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []
      setRecordingTime(0)

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioFile(blob)
        onAudioReady(blob, 'record')
        stream.getTracks().forEach((t) => t.stop())
        if (recordingIntervalRef.current) {
          clearInterval(recordingIntervalRef.current)
        }
      }

      mr.start()
      setRecording(true)
      
      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
      
    } catch (e) {
      console.error('[Audio] mic error', e)
      alert('Microphone not available or permission denied.')
    }
  }, [onAudioReady])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }, [])

  const clearAudio = useCallback(() => {
    setAudioFile(null)
    setUploadProgress(0)
    setRecordingTime(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Upload Area */}
        <motion.div
          className={cn(
            "relative border-2 border-dashed transition-all duration-300 cursor-pointer",
            dragActive 
              ? "border-primary bg-primary/5 scale-[1.02]" 
              : "border-border hover:border-primary/50 hover:bg-accent/5",
            audioFile && "border-green-500 bg-green-50/50"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !audioFile && fileInputRef.current?.click()}
          whileHover={{ scale: audioFile ? 1 : 1.01 }}
          whileTap={{ scale: audioFile ? 1 : 0.99 }}
        >
          <div className="p-8 text-center space-y-4">
            <AnimatePresence mode="wait">
              {uploadProgress > 0 && uploadProgress < 100 ? (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="space-y-3"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Uploading...</div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <motion.div 
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">{uploadProgress}%</div>
                  </div>
                </motion.div>
              ) : audioFile ? (
                <motion.div
                  key="uploaded"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="space-y-3"
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-foreground flex items-center justify-center gap-2">
                      <File className="w-4 h-4" />
                      {audioFile.name || 'Recorded Audio'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Audio ready for analysis
                    </div>
                  </div>
                  <AnimatedButton
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      clearAudio()
                    }}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    Clear
                  </AnimatedButton>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="space-y-4"
                >
                  <motion.div 
                    className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center"
                    animate={{ 
                      scale: dragActive ? [1, 1.1, 1] : 1,
                      rotate: dragActive ? [0, 5, -5, 0] : 0 
                    }}
                    transition={{ duration: 0.5, repeat: dragActive ? Infinity : 0 }}
                  >
                    <Upload className="w-8 h-8 text-accent" />
                  </motion.div>
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-foreground">
                      Drop your audio file here
                    </div>
                    <div className="text-sm text-muted-foreground">
                      or click to browse • Supports MP3, WAV, M4A
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Animated border glow on drag */}
          <AnimatePresence>
            {dragActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 animate-pulse"
                style={{ 
                  background: 'linear-gradient(45deg, var(--primary) 0%, var(--accent) 50%, var(--primary) 100%)',
                  opacity: 0.1
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>

        {/* Divider */}
        <div className="flex items-center py-4 px-6">
          <div className="flex-1 h-px bg-border"></div>
          <span className="px-3 text-sm text-muted-foreground font-medium">OR</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Recording Section */}
        <div className="p-6 space-y-4">
          <div className="text-center space-y-4">
            <motion.div
              className="inline-flex items-center gap-3"
              animate={{ scale: recording ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 1, repeat: recording ? Infinity : 0 }}
            >
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                recording 
                  ? "bg-red-100 text-red-600 shadow-lg shadow-red-500/25" 
                  : "bg-primary/10 text-primary"
              )}>
                {recording ? (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    <MicOff className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <Mic className="w-6 h-6" />
                )}
              </div>
              
              <div className="text-left">
                <div className="text-sm font-medium text-foreground">
                  {recording ? 'Recording...' : 'Record Audio'}
                </div>
                {recording && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-muted-foreground font-mono"
                  >
                    {formatTime(recordingTime)}
                  </motion.div>
                )}
              </div>
            </motion.div>

            <div className="flex justify-center gap-3">
              {!recording ? (
                <AnimatedButton
                  onClick={startRecording}
                  variant="outline"
                  className="gap-2"
                  disabled={!!audioFile}
                >
                  <Mic className="w-4 h-4" />
                  Start Recording
                </AnimatedButton>
              ) : (
                <AnimatedButton
                  onClick={stopRecording}
                  variant="outline"
                  className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <MicOff className="w-4 h-4" />
                  Stop Recording
                </AnimatedButton>
              )}
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}