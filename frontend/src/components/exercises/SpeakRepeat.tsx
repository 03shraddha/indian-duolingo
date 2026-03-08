import { useEffect, useRef, useState } from 'react'
import { tts, stt } from '../../api/sarvam'
import { useAudio } from '../../hooks/useAudio'
import type { Exercise, LanguageConfig } from '../../types'

interface Props {
  exercise: Exercise
  langCfg: LanguageConfig
  /**
   * Called when user clicks Continue after reviewing inline feedback.
   * SpeakRepeat manages its own feedback — the global FeedbackOverlay
   * is not used for this exercise type.
   */
  onResult: (correct: boolean) => void
}

/** Bigram similarity (0–1) — works for any script */
function similarity(a: string, b: string): number {
  const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '')
  const na = norm(a), nb = norm(b)
  if (na === nb) return 1
  if (!na || !nb) return 0
  const bigrams = (s: string) => {
    const set = new Set<string>()
    for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2))
    return set
  }
  const ba = bigrams(na), bb = bigrams(nb)
  let hits = 0
  ba.forEach((g) => { if (bb.has(g)) hits++ })
  return (2 * hits) / (ba.size + bb.size)
}

const PASS = 0.50

function qualitativeFeedback(score: number, target: string) {
  if (score >= 0.85) return { ok: true,  label: 'Excellent! 🎉', note: 'Your pronunciation is spot on.' }
  if (score >= 0.65) return { ok: true,  label: 'Good try! 👍',  note: `Focus on the sounds in "${target}" more carefully.` }
  if (score >= PASS)  return { ok: true,  label: 'Almost there!', note: 'Listen once more and speak slowly.' }
  return               { ok: false, label: 'Keep practising 💪', note: 'Try listening a few times, then speak.' }
}

export default function SpeakRepeat({ exercise, langCfg, onResult }: Props) {
  const { play } = useAudio()
  const [audioBase64, setAudioBase64] = useState<string | null>(null)
  const [audioSlow,   setAudioSlow]   = useState<string | null>(null)
  const [loadingTTS,  setLoadingTTS]  = useState(true)

  const [recording,  setRecording]  = useState(false)
  const [processing, setProcessing] = useState(false)
  const [score,      setScore]      = useState<number | null>(null)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [error,      setError]      = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef   = useRef<Blob[]>([])

  // Load both normal and slow TTS on mount, then auto-play normal
  useEffect(() => {
    let cancelled = false
    setLoadingTTS(true)
    setScore(null)
    setTranscript(null)
    setError(null)

    const ttsOpts = {
      language_code: langCfg.languageCode,
      speaker: langCfg.ttsDefaultSpeaker,
    }

    Promise.all([
      tts({ text: exercise.targetText, ...ttsOpts, pace: 1.0 }),
      tts({ text: exercise.targetText, ...ttsOpts, pace: 0.7 }),
    ])
      .then(([normal, slow]) => {
        if (cancelled) return
        setAudioBase64(normal)
        setAudioSlow(slow)
        setLoadingTTS(false)
        return play(normal)
      })
      .catch((e) => {
        if (!cancelled) { setError(e.message); setLoadingTTS(false) }
      })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id])

  async function startRecording() {
    if (recording || processing) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunksRef.current = []
      recorderRef.current = recorder

      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        setRecording(false)
        setProcessing(true)
        try {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          const text = await stt(blob, langCfg.languageCode)
          setTranscript(text)
          setScore(similarity(text, exercise.targetText))
        } catch (e: unknown) {
          setError(e instanceof Error ? e.message : 'STT failed')
        } finally {
          setProcessing(false)
        }
      }

      recorder.start()
      setRecording(true)
    } catch {
      setError('Microphone access denied.')
    }
  }

  function stopRecording() {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }

  const fb   = score !== null ? qualitativeFeedback(score, exercise.targetText) : null
  const done = score !== null && !processing

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6 max-w-md mx-auto w-full">

      {/* Instruction */}
      <p className="text-sm font-semibold" style={{ color: '#6B7280' }}>
        Tap the card to hear it, then repeat
      </p>

      {/* Phrase card — tappable */}
      <button
        onClick={() => audioBase64 && play(audioBase64)}
        disabled={loadingTTS}
        className="w-full rounded-3xl text-center active:scale-98 transition-transform disabled:opacity-60"
        style={{
          background: '#FFFFFF', border: '1.5px solid #EDE8E0',
          boxShadow: '0 6px 20px rgba(0,0,0,0.07)', padding: '28px 24px',
          cursor: loadingTTS ? 'default' : 'pointer',
        }}
      >
        <div className="flex justify-end mb-1">
          <span style={{ color: '#FFC857', fontSize: 18 }}>{loadingTTS ? '⏳' : '🔊'}</span>
        </div>
        {/* Target language phrase — dominant */}
        <p className={`font-bold mb-2 ${langCfg.scriptClass}`}
          style={{ fontSize: 44, color: '#1F3A5F', lineHeight: 1.2 }}>
          {exercise.targetText}
        </p>
        {/* Romanization — muted terracotta, softer than orange */}
        <p className="font-medium mb-1"
          style={{ fontSize: 18, color: '#E07A5F', fontStyle: 'italic' }}>
          {exercise.romanized}
        </p>
        {/* English — smallest */}
        <p style={{ fontSize: 13, color: '#9CA3AF' }}>{exercise.englishText}</p>
      </button>

      {/* Replay row: normal + slow */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => audioBase64 && play(audioBase64)}
          disabled={!audioBase64}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold active:scale-95 transition-transform disabled:opacity-40"
          style={{ background: '#FFF3E6', color: '#FF7A00', border: '1px solid #FFD3A3', cursor: 'pointer' }}
        >
          🔊 Normal
        </button>
        <button
          onClick={() => audioSlow && play(audioSlow)}
          disabled={!audioSlow}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold active:scale-95 transition-transform disabled:opacity-40"
          style={{ background: '#F8F5F0', color: '#6B7280', border: '1px solid #EDE8E0', cursor: 'pointer' }}
        >
          🐢 Slow
        </button>
      </div>

      {/* Press-and-hold mic */}
      {!done && (
        <div className="flex flex-col items-center gap-2">
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={(e) => { e.preventDefault(); startRecording() }}
            onTouchEnd={stopRecording}
            disabled={processing || loadingTTS}
            className="flex flex-col items-center justify-center rounded-full text-white select-none"
            style={{
              width: 88, height: 88, fontSize: 30, border: 'none',
              background: recording
                ? 'linear-gradient(135deg,#E07A5F,#C04A24)'
                : 'linear-gradient(135deg,#FF7A00,#FFC857)',
              boxShadow: recording
                ? '0 0 0 10px rgba(224,122,95,0.18),0 0 0 22px rgba(224,122,95,0.07)'
                : '0 8px 20px rgba(255,122,0,0.28)',
              animation: recording ? 'micPulse 1s ease-in-out infinite' : 'none',
              transition: 'background 0.2s, box-shadow 0.2s',
              cursor: processing ? 'default' : 'pointer',
            }}
          >
            {processing ? '⏳' : recording ? '⏹' : '🎤'}
          </button>
          <p className="text-xs font-medium" style={{ color: '#9CA3AF' }}>
            {processing ? 'Analysing…' : recording ? 'Release to stop' : 'Hold to record'}
          </p>
        </div>
      )}

      {/* Inline qualitative feedback */}
      {done && fb && (
        <div
          className="w-full rounded-2xl px-5 py-4"
          style={{
            background: fb.ok ? '#F0FAF5' : '#FEF3EE',
            border: `1.5px solid ${fb.ok ? '#B7E4C7' : '#F0C4B4'}`,
          }}
        >
          <p className="font-bold text-base mb-1"
            style={{ color: fb.ok ? '#52B788' : '#E07A5F' }}>
            {fb.label}
          </p>
          <p className="text-sm mb-3" style={{ color: '#6B7280' }}>{fb.note}</p>
          {transcript !== null && (
            <p className="text-xs" style={{ color: '#9CA3AF' }}>
              You said:{' '}
              <span className={`font-semibold ${langCfg.scriptClass}`} style={{ color: '#1F3A5F' }}>
                {transcript || '(nothing detected)'}
              </span>
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-center" style={{ color: '#E07A5F' }}>⚠️ {error}</p>
      )}

      {/* Continue */}
      {done && fb && (
        <button
          onClick={() => onResult(fb.ok)}
          className="w-full font-bold text-white active:scale-95 transition-transform"
          style={{
            height: 52, borderRadius: 16, fontSize: 17, border: 'none',
            background: fb.ok ? 'linear-gradient(135deg,#52B788,#40916C)' : '#FF7A00',
            boxShadow: '0 6px 16px rgba(0,0,0,0.10)',
            cursor: 'pointer',
          }}
        >
          Continue →
        </button>
      )}
    </div>
  )
}
