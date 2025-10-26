import { useEffect, useRef, useState } from 'react'
import PrebuiltButton from '@/components/PrebuiltButton'
import { Card, CardContent } from '@/components/ui/card'

export default function AudioControls({ onAudioReady }) {
  const [recording, setRecording] = useState(false)
  const [ready, setReady] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mr = new MediaRecorder(stream)
      mediaRecorderRef.current = mr
      chunksRef.current = []
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setReady(blob)
        onAudioReady(blob, 'record')
        stream.getTracks().forEach((t) => t.stop())
      }
      mr.start()
      setRecording(true)
    } catch (e) {
      console.error('[Audio] mic error', e)
      alert('Microphone not available or permission denied.')
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setRecording(false)
    }
  }

  function onUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setReady(file)
    onAudioReady(file, 'upload')
  }

  return (
    <Card className="card-pop">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="audio/*"
              onChange={onUpload}
              aria-label="Upload audio file"
              className="text-sm"
            />
            <span className="text-muted-foreground text-sm">or</span>
            {!recording ? (
              <PrebuiltButton onClick={startRecording} className="pressable" variant="secondary">
                Record
              </PrebuiltButton>
            ) : (
              <PrebuiltButton onClick={stopRecording} className="pressable" variant="ghost">
                Stop
              </PrebuiltButton>
            )}
          </div>

          <div aria-live="polite" className="text-sm text-muted-foreground">
            {recording ? 'Recording...' : ready ? 'Audio ready.' : 'No audio selected.'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}