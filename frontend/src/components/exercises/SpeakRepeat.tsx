import { useEffect, useRef, useState, useCallback } from 'react'
import { tts, stt } from '../../api/sarvam'
import { useAudio } from '../../hooks/useAudio'
import type { Exercise, LanguageConfig } from '../../types'

interface Props {
  exercise: Exercise
  langCfg: LanguageConfig
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

/** 4-bar waveform animation — shown during TTS playback */
function WaveformBars({ color = '#FFC857' }: { color?: string }) {
  const heights = [14, 22, 18, 12]
  return (
    <div className="flex items-end gap-1" style={{ height: 24, color }}>
      {heights.map((h, i) => (
        <span key={i} className="wave-bar" style={{ height: h }} />
      ))}
    </div>
  )
}

export default function SpeakRepeat({ exercise, langCfg, onResult }: Props) {
  const { play } = useAudio()
  const [audioBase64, setAudioBase64] = useState<string | null>(null)
  const [audioSlow,   setAudioSlow]   = useState<string | null>(null)
  const [loadingTTS,  setLoadingTTS]  = useState(true)
  const [playing,     setPlaying]     = useState(false)
  const [activeSpeed, setActiveSpeed] = useState<'normal' | 'slow'>('normal')

  const [recording,  setRecording]  = useState(false)
  const [processing, setProcessing] = useState(false)
  const [score,      setScore]      = useState<number | null>(null)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [error,      setError]      = useState<string | null>(null)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef   = useRef<Blob[]>([])

  /** Wraps play() to set playing state — drives card animation */
  const playWithFeedback = useCallback(async (base64: string) => {
    setPlaying(true)
    try { await play(base64) } finally { setPlaying(false) }
  }, [play])

  useEffect(() => {
    let cancelled = false
    setLoadingTTS(true)
    setScore(null)
    setTranscript(null)
    setError(null)
    setPlaying(false)
    setActiveSpeed('normal')

    const ttsOpts = { language_code: langCfg.languageCode, speaker: langCfg.ttsDefaultSpeaker }

    Promise.all([
      tts({ text: exercise.targetText, ...ttsOpts, pace: 1.0 }),
      tts({ text: exercise.targetText, ...ttsOpts, pace: 0.7 }),
    ])
      .then(([normal, slow]) => {
        if (cancelled) return
        setAudioBase64(normal)
        setAudioSlow(slow)
        setLoadingTTS(false)
        return playWithFeedback(normal)
      })
      .catch((e) => { if (!cancelled) { setError(e.message); setLoadingTTS(false) } })

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id])

  function handleSpeedToggle(speed: 'normal' | 'slow') {
    setActiveSpeed(speed)
    const audio = speed === 'slow' ? audioSlow : audioBase64
    if (audio) playWithFeedback(audio)
  }

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
        } finally { setProcessing(false) }
      }
      recorder.start()
      setRecording(true)
    } catch { setError('Microphone access denied.') }
  }

  function stopRecording() {
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }

  const fb   = score !== null ? qualitativeFeedback(score, exercise.targetText) : null
  const done = score !== null && !processing

  return (
    <div className="flex flex-col items-center px-4 py-6 max-w-md mx-auto w-full" style={{ gap: 16 }}>

      {/* Instruction — lowercase, conversational */}
      <p className="font-semibold" style={{ fontSize: 17, color: '#6B7280' }}>
        tap the card to hear it, then repeat
      </p>

      {/* Phrase card — animated border + waveform when playing */}
      <button
        onClick={() => audioBase64 && playWithFeedback(audioBase64)}
        disabled={loadingTTS}
        className="w-full rounded-3xl text-center disabled:opacity-60"
        style={{
          background: '#FFFFFF',
          border: playing ? '2px solid #FFC857' : '1.5px solid #EDE8E0',
          boxShadow: playing
            ? '0 0 0 4px rgba(255,200,87,0.18), 0 6px 20px rgba(0,0,0,0.07)'
            : '0 6px 20px rgba(0,0,0,0.07)',
          padding: '24px 24px 20px',
          cursor: loadingTTS ? 'default' : 'pointer',
          transition: 'border 0.2s ease, box-shadow 0.3s ease',
        }}
      >
        <div className="flex justify-end mb-2" style={{ height: 24 }}>
          {playing
            ? <WaveformBars color="#FFC857" />
            : <span style={{ color: '#FFC857', fontSize: 18 }}>{loadingTTS ? '⏳' : '🔊'}</span>
          }
        </div>
        <p className={`font-bold mb-2 ${langCfg.scriptClass}`}
          style={{ fontSize: 44, color: '#1F3A5F', lineHeight: 1.2 }}>
          {exercise.targetText}
        </p>
        <p className="font-medium mb-1" style={{ fontSize: 18, color: '#E07A5F', fontStyle: 'italic' }}>
          {exercise.romanized}
        </p>
        <p style={{ fontSize: 13, color: '#9CA3AF' }}>{exercise.englishText}</p>
      </button>

      {/* Speed segmented control + mic — grouped together, tight gap */}
      {!done && (
        <div className="flex flex-col items-center" style={{ gap: 14 }}>

          {/* Segmented pill: ▶▶ Normal | ▶ Slow */}
          <div
            className="flex rounded-full overflow-hidden"
            style={{ border: '1.5px solid #EDE8E0', background: '#F8F5F0', opacity: loadingTTS ? 0.5 : 1 }}
          >
            {(['normal', 'slow'] as const).map((speed) => {
              const active = activeSpeed === speed
              return (
                <button
                  key={speed}
                  onClick={() => !loadingTTS && handleSpeedToggle(speed)}
                  disabled={loadingTTS}
                  className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold transition-all"
                  style={{
                    background: active ? '#1F3A5F' : 'transparent',
                    color: active ? '#FFFFFF' : '#9CA3AF',
                    border: 'none',
                    cursor: 'pointer',
                    borderRadius: speed === 'normal' ? '999px 0 0 999px' : '0 999px 999px 0',
                  }}
                >
                  <span style={{ fontSize: 11, opacity: 0.75 }}>
                    {speed === 'normal' ? '▶▶' : '▶'}
                  </span>
                  {speed === 'normal' ? 'Normal' : 'Slow'}
                </button>
              )
            })}
          </div>

          {/* Mic — directly below speed control */}
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
          {/* lowercase mic state label */}
          <p className="text-xs font-medium" style={{ color: '#9CA3AF', marginTop: -8 }}>
            {processing ? 'analysing…' : recording ? 'release to stop' : 'hold to record'}
          </p>
        </div>
      )}

      {done && fb && (
        <div className="w-full rounded-2xl px-5 py-4"
          style={{
            background: fb.ok ? '#EFF4EF' : '#FEF3EE',
            border: `1.5px solid ${fb.ok ? '#C4D6C4' : '#F0C4B4'}`,
          }}
        >
          <p className="font-bold text-base mb-1" style={{ color: fb.ok ? '#4A7459' : '#E07A5F' }}>
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

      {error && <p className="text-sm text-center" style={{ color: '#E07A5F' }}>⚠️ {error}</p>}

      {done && fb && (
        <button
          onClick={() => onResult(fb.ok)}
          className="w-full font-bold text-white active:scale-95 transition-transform"
          style={{
            height: 52, borderRadius: 16, fontSize: 17, border: 'none',
            background: fb.ok ? 'linear-gradient(135deg,#4A7459,#7A9E82)' : '#FF7A00',
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
