import { useEffect, useRef, useState, useCallback } from 'react'
import { stt, prefetchTTSStream, type TTSOptions } from '../../api/sarvam'
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

function qualitativeFeedback(score: number, romanized: string) {
  const firstChunk = romanized.split(/[,!?]/)[0].trim()
  if (score >= 0.85) return {
    ok: true,
    label: '🎉 Excellent!',
    note: 'Your pronunciation is spot on — great work!',
  }
  if (score >= 0.65) return {
    ok: true,
    label: '👍 Good try!',
    note: `Close! Focus on the ending sounds — say "${firstChunk}" slowly, one syllable at a time.`,
  }
  if (score >= PASS) return {
    ok: true,
    label: '🌱 Almost there!',
    note: `Use the slow ▶ speed, then try repeating "${firstChunk}" aloud before recording.`,
  }
  return {
    ok: false,
    label: '💪 Keep practising',
    note: `Listen to the slow version a few times and focus on matching each syllable of "${firstChunk}".`,
  }
}

/** 4-bar waveform animation */
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
  const { playStream } = useAudio()
  const [loadingTTS,  setLoadingTTS]  = useState(true)
  const [playing,     setPlaying]     = useState(false)
  const [activeSpeed, setActiveSpeed] = useState<'normal' | 'slow'>('normal')

  const [recording,  setRecording]  = useState(false)
  const [processing, setProcessing] = useState(false)
  const [score,      setScore]      = useState<number | null>(null)
  const [transcript, setTranscript] = useState<string | null>(null)
  const [error,      setError]      = useState<string | null>(null)

  const recorderRef    = useRef<MediaRecorder | null>(null)
  const chunksRef      = useRef<Blob[]>([])
  const maxRecTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const ttsBase: TTSOptions = {
    language_code: langCfg.languageCode,
    speaker: langCfg.ttsDefaultSpeaker,
    text: exercise.targetText,
  }
  const normalOpts: TTSOptions = { ...ttsBase, pace: 1.0 }
  const slowOpts:   TTSOptions = { ...ttsBase, pace: 0.7 }

  const playWithFeedback = useCallback(async (opts: TTSOptions, onPlay?: () => void) => {
    setPlaying(true)
    try {
      await playStream(opts, onPlay)
    } finally {
      setPlaying(false)
    }
  }, [playStream])

  useEffect(() => {
    let cancelled = false
    setLoadingTTS(true)
    setScore(null)
    setTranscript(null)
    setError(null)
    setPlaying(false)
    setActiveSpeed('normal')

    // Prefetch slow version in the background while normal plays
    prefetchTTSStream(slowOpts)

    const run = async () => {
      try {
        // onPlay fires on first chunk — hide spinner and enable controls immediately
        await playWithFeedback(normalOpts, () => {
          if (!cancelled) setLoadingTTS(false)
        })
      } catch {
        if (cancelled) return
        // Retry once after 1.5 s (backend cold-start)
        setTimeout(async () => {
          if (cancelled) return
          try {
            await playWithFeedback(normalOpts, () => {
              if (!cancelled) setLoadingTTS(false)
            })
          } catch (retryErr) {
            if (!cancelled) { setError((retryErr as Error).message); setLoadingTTS(false) }
          }
        }, 1500)
      }
    }

    run()

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id])

  function handleSpeedToggle(speed: 'normal' | 'slow') {
    setActiveSpeed(speed)
    if (!playing) playWithFeedback(speed === 'slow' ? slowOpts : normalOpts)
  }

  async function startRecording() {
    if (recording || processing) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const CANDIDATES = [
        { mime: 'audio/webm;codecs=opus', ext: 'webm' },
        { mime: 'audio/ogg;codecs=opus',  ext: 'ogg'  },
        { mime: 'audio/mp4',              ext: 'mp4'  },
        { mime: 'audio/webm',             ext: 'webm' },
      ]
      const chosen = CANDIDATES.find(c => MediaRecorder.isTypeSupported(c.mime))
        ?? { mime: '', ext: 'webm' }
      const recOpts = chosen.mime
        ? { mimeType: chosen.mime, audioBitsPerSecond: 24000 }
        : { audioBitsPerSecond: 24000 }

      const recorder = new MediaRecorder(stream, recOpts)
      chunksRef.current = []
      recorderRef.current = recorder
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop())
        setRecording(false)
        setProcessing(true)
        try {
          const actualMime = recorder.mimeType || chosen.mime || 'audio/webm'
          const ext = CANDIDATES.find(c => actualMime.startsWith(c.mime.split(';')[0]))?.ext ?? chosen.ext
          const blob = new Blob(chunksRef.current, { type: actualMime })
          const text = await Promise.race([
            stt(blob, langCfg.languageCode, ext),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('timeout')), 40_000)
            ),
          ])
          setTranscript(text)
          setScore(similarity(text, exercise.targetText))
        } catch {
          setError("Couldn't process your recording. Try again.")
        } finally { setProcessing(false) }
      }
      recorder.start()
      setRecording(true)
      maxRecTimerRef.current = setTimeout(() => {
        if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
      }, 60_000)
    } catch { setError('Microphone access denied. Check browser permissions.') }
  }

  function stopRecording() {
    if (maxRecTimerRef.current) { clearTimeout(maxRecTimerRef.current); maxRecTimerRef.current = null }
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
  }

  const fb   = score !== null ? qualitativeFeedback(score, exercise.romanized) : null
  const done = score !== null && !processing

  const cardBg     = done && fb ? (fb.ok ? '#EFF4EF' : '#FEF3EE') : '#FFFFFF'
  const cardBorder = done && fb
    ? (fb.ok ? '2px solid #C4D6C4' : '2px solid #F0C4B4')
    : playing ? '2px solid #FFC857' : '1.5px solid #EDE8E0'
  const cardShadow = done && fb
    ? (fb.ok
        ? '0 0 0 4px rgba(196,214,196,0.2), 0 6px 20px rgba(0,0,0,0.06)'
        : '0 0 0 4px rgba(240,196,180,0.2), 0 6px 20px rgba(0,0,0,0.06)')
    : playing
      ? '0 0 0 4px rgba(255,200,87,0.18), 0 6px 20px rgba(0,0,0,0.07)'
      : '0 6px 20px rgba(0,0,0,0.07)'

  return (
    <div className="flex flex-col items-center px-3 sm:px-4 py-5 sm:py-6 max-w-md mx-auto w-full" style={{ gap: 14 }}>

      {/* Instruction */}
      <p className="font-semibold text-sm sm:text-base" style={{ color: '#6B7280' }}>
        tap the card to hear it, then repeat
      </p>

      {/* Word card */}
      <button
        onClick={() => !loadingTTS && playWithFeedback(activeSpeed === 'slow' ? slowOpts : normalOpts)}
        disabled={loadingTTS}
        className={`exercise-card w-full rounded-3xl text-center ${loadingTTS ? 'audio-loading-card' : ''}`}
        style={{
          background: cardBg,
          border: loadingTTS ? '1.5px solid #EDE8E0' : cardBorder,
          boxShadow: loadingTTS ? undefined : cardShadow,
          padding: 'clamp(14px, 4vw, 20px) clamp(14px, 4vw, 24px)',
          cursor: loadingTTS ? 'default' : 'pointer',
          transition: loadingTTS ? 'none' : 'border 0.25s ease, box-shadow 0.3s ease, background 0.25s ease',
        }}
      >
        <div className="flex items-center justify-between mb-2" style={{ height: 28 }}>
          {done && fb ? (
            <span className="font-bold text-sm sm:text-base" style={{ color: fb.ok ? '#4A7459' : '#E07A5F' }}>
              {fb.label}
            </span>
          ) : (
            <span />
          )}
          <span>
            {playing
              ? <WaveformBars color={done && fb ? (fb.ok ? '#7A9E82' : '#E07A5F') : '#FFC857'} />
              : <span style={{ color: done && fb ? (fb.ok ? '#7A9E82' : '#E07A5F') : '#FFC857', fontSize: 18 }}>
                  🔊
                </span>
            }
          </span>
        </div>

        <p className={`font-bold mb-2 ${langCfg.scriptClass}`}
          style={{ fontSize: 'clamp(28px, 9vw, 44px)', color: '#1F3A5F', lineHeight: 1.2 }}>
          {exercise.targetText}
        </p>

        <p className="font-medium mb-1" style={{ fontSize: 'clamp(14px, 4vw, 18px)', color: '#E07A5F', fontStyle: 'italic' }}>
          {exercise.romanized}
        </p>

        <p style={{ fontSize: 12, color: '#9CA3AF' }}>{exercise.englishText}</p>

        {done && fb && (
          <>
            <div style={{ height: 1, background: fb.ok ? '#C4D6C4' : '#F0C4B4', margin: '12px 0 10px' }} />
            <p className="text-sm text-left" style={{ color: '#6B7280' }}>{fb.note}</p>
            <div className="text-left mt-3" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '4px 8px', alignItems: 'baseline' }}>
              <span className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>target:</span>
              <span className="text-xs font-semibold" style={{ color: '#4A7459', fontStyle: 'italic' }}>
                {exercise.romanized}
              </span>
              {transcript !== null && (
                <>
                  <span className="text-xs font-semibold" style={{ color: '#9CA3AF' }}>you said:</span>
                  <span className={`text-xs font-semibold ${langCfg.scriptClass}`} style={{ color: '#1F3A5F' }}>
                    {transcript || '(nothing detected)'}
                  </span>
                </>
              )}
            </div>
          </>
        )}
      </button>

      {!done && loadingTTS && (
        <div className="flex flex-col items-center" style={{ gap: 10, minHeight: 120, justifyContent: 'center' }}>
          <div
            className="audio-spinner"
            style={{ width: 44, height: 44, borderRadius: '50%', border: '4px solid #EDE8E0', borderTopColor: '#FF7A00' }}
          />
          <p className="text-sm font-semibold" style={{ color: '#9CA3AF' }}>Preparing audio…</p>
        </div>
      )}

      {!done && !loadingTTS && (
        <div className="flex flex-col items-center" style={{ gap: 14 }}>
          <div className="flex rounded-full overflow-hidden" style={{ border: '1.5px solid #EDE8E0', background: '#F8F5F0' }}>
            {(['normal', 'slow'] as const).map((speed) => {
              const active = activeSpeed === speed
              return (
                <button
                  key={speed}
                  onClick={() => handleSpeedToggle(speed)}
                  className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold transition-all"
                  style={{
                    background: active ? '#1F3A5F' : 'transparent',
                    color: active ? '#FFFFFF' : '#9CA3AF',
                    border: 'none', cursor: 'pointer',
                    borderRadius: speed === 'normal' ? '999px 0 0 999px' : '0 999px 999px 0',
                  }}
                >
                  <span style={{ fontSize: 11, opacity: 0.75 }}>{speed === 'normal' ? '▶▶' : '▶'}</span>
                  {speed === 'normal' ? 'Normal' : 'Slow'}
                </button>
              )
            })}
          </div>

          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={(e) => { e.preventDefault(); startRecording() }}
            onTouchEnd={stopRecording}
            disabled={processing}
            className="flex flex-col items-center justify-center rounded-full text-white select-none"
            style={{
              width: 80, height: 80, fontSize: 28, border: 'none',
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
          <p className="text-xs font-medium" style={{ color: '#9CA3AF', marginTop: -6 }}>
            {processing ? 'analysing…' : recording ? 'release to stop' : 'hold to record'}
          </p>
        </div>
      )}

      {error && !done && (
        <div className="w-full flex flex-col items-center gap-2">
          <p className="text-sm text-center" style={{ color: '#E07A5F' }}>⚠️ {error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs font-semibold px-4 py-1.5 rounded-full active:scale-95 transition-transform"
            style={{ background: '#F0EDE8', color: '#6B7280', border: '1px solid #EDE8E0', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      )}

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
