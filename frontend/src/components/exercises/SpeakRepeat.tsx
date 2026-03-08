import { useEffect, useState } from 'react'
import { tts, stt } from '../../api/sarvam'
import { useAudio } from '../../hooks/useAudio'
import { useMicrophone } from '../../hooks/useMicrophone'
import type { Exercise } from '../../types'

interface Props {
  exercise: Exercise
  onResult: (correct: boolean) => void
}

/** Simple character-overlap similarity (0–1). Handles Devanagari well. */
function similarity(a: string, b: string): number {
  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '')
  const na = normalize(a)
  const nb = normalize(b)
  if (na === nb) return 1
  if (!na || !nb) return 0

  // Bigram overlap
  const bigrams = (s: string) => {
    const set = new Set<string>()
    for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2))
    return set
  }
  const ba = bigrams(na)
  const bb = bigrams(nb)
  let matches = 0
  ba.forEach((bg) => { if (bb.has(bg)) matches++ })
  return (2 * matches) / (ba.size + bb.size)
}

const PASS_THRESHOLD = 0.5 // 50% bigram overlap to pass

export default function SpeakRepeat({ exercise, onResult }: Props) {
  const { play } = useAudio()
  const { micState, audioBlob, startRecording, stopRecording, resetMic } = useMicrophone()

  const [loadingTTS, setLoadingTTS] = useState(true)
  const [audioBase64, setAudioBase64] = useState<string | null>(null)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [score, setScore] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load TTS model pronunciation on mount
  useEffect(() => {
    let cancelled = false
    setLoadingTTS(true)
    setTranscript(null)
    setScore(null)
    setSubmitted(false)
    resetMic()

    tts({ text: exercise.hindiText, language_code: 'hi-IN' })
      .then((b64) => {
        if (cancelled) return
        setAudioBase64(b64)
        setLoadingTTS(false)
        return play(b64)
      })
      .catch((e) => { if (!cancelled) { setError(e.message); setLoadingTTS(false) } })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id])

  // When a new audio blob is ready, transcribe it
  useEffect(() => {
    if (!audioBlob) return
    setError(null)

    stt(audioBlob, 'hi-IN')
      .then((text) => {
        setTranscript(text)
        const sim = similarity(text, exercise.hindiText)
        setScore(Math.round(sim * 100))
        setSubmitted(true)
        onResult(sim >= PASS_THRESHOLD)
      })
      .catch((e) => setError(e.message))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob])

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6 max-w-md mx-auto w-full">
      {/* Instruction */}
      <p className="text-base font-semibold" style={{ color: '#4A4A6A' }}>
        🎤 Listen, then repeat the phrase
      </p>

      {/* Hindi phrase to repeat */}
      <div
        className="w-full rounded-3xl p-6 text-center shadow-md"
        style={{ background: '#1E3A5F' }}
      >
        <p className="devanagari text-4xl font-bold text-white mb-2">{exercise.hindiText}</p>
        <p className="text-sm italic" style={{ color: '#FFB800' }}>
          {exercise.hindiRomanized}
        </p>
        <p className="text-xs mt-1 text-white opacity-60">{exercise.englishText}</p>
      </div>

      {/* Play model pronunciation */}
      <button
        disabled={loadingTTS || !audioBase64}
        onClick={() => audioBase64 && play(audioBase64)}
        className="flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm shadow active:scale-95 transition-transform disabled:opacity-50"
        style={{ background: '#FFF3E0', color: '#FF6B00', border: '1px solid #FFB800' }}
      >
        {loadingTTS ? '⏳ Loading…' : '🔊 Hear pronunciation'}
      </button>

      {/* Mic controls */}
      {!submitted && (
        <div className="flex flex-col items-center gap-3">
          {micState === 'idle' && (
            <button
              onClick={startRecording}
              className="w-24 h-24 rounded-full flex flex-col items-center justify-center text-3xl shadow-lg active:scale-95 transition-transform text-white font-bold"
              style={{ background: 'linear-gradient(135deg, #FF6B00, #FFB800)' }}
            >
              🎤
              <span className="text-xs mt-1">RECORD</span>
            </button>
          )}
          {micState === 'recording' && (
            <button
              onClick={stopRecording}
              className="w-24 h-24 rounded-full flex flex-col items-center justify-center text-3xl shadow-lg mic-pulse active:scale-95 transition-transform text-white font-bold"
              style={{ background: '#E74C3C' }}
            >
              ⏹
              <span className="text-xs mt-1">STOP</span>
            </button>
          )}
          {micState === 'processing' && (
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-4xl"
              style={{ background: '#FFF3E0' }}
            >
              ⏳
            </div>
          )}
        </div>
      )}

      {/* Transcript + score result */}
      {submitted && transcript !== null && (
        <div
          className="w-full rounded-2xl p-4 text-center shadow"
          style={{ background: '#FFF3E0', border: '2px solid #FFB800' }}
        >
          <p className="text-xs font-semibold mb-1" style={{ color: '#4A4A6A' }}>
            You said:
          </p>
          <p className="devanagari text-2xl font-bold mb-2" style={{ color: '#1E3A5F' }}>
            {transcript || '(no speech detected)'}
          </p>
          <p
            className="text-lg font-bold"
            style={{ color: score !== null && score >= PASS_THRESHOLD * 100 ? '#00A896' : '#C85C3A' }}
          >
            Match: {score}%
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-center" style={{ color: '#E74C3C' }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  )
}
