import { useCallback, useRef, useState } from 'react'

type MicState = 'idle' | 'recording' | 'processing' | 'error'

/**
 * Record audio from the user's microphone.
 * Returns controls to start/stop recording and the recorded Blob.
 */
export function useMicrophone() {
  const [micState, setMicState] = useState<MicState>('idle')
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        // Stop all tracks so the browser mic indicator turns off
        stream.getTracks().forEach((t) => t.stop())
        setMicState('idle')
      }

      recorder.start()
      setMicState('recording')
      setAudioBlob(null)
    } catch {
      setMicState('error')
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      setMicState('processing')
      mediaRecorderRef.current.stop()
    }
  }, [])

  const resetMic = useCallback(() => {
    setAudioBlob(null)
    setMicState('idle')
  }, [])

  return { micState, audioBlob, startRecording, stopRecording, resetMic }
}
