import { useEffect, useState, useMemo, useRef } from 'react'
import { tts } from '../../api/sarvam'
import { useAudio } from '../../hooks/useAudio'
import type { Exercise, LanguageConfig } from '../../types'

interface Props {
  exercise: Exercise
  langCfg: LanguageConfig
  onResult: (correct: boolean) => void
}

/** 4-bar waveform animation — same as SpeakRepeat */
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

const INSTR = 'listen and choose the correct meaning'

export default function ListenIdentify({ exercise, langCfg, onResult }: Props) {
  const { play } = useAudio()
  const [loading, setLoading] = useState(true)
  const [audioBase64, setAudioBase64] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Typewriter for instruction
  const [instrLen, setInstrLen] = useState(0)

  // Script reveal (grapheme by grapheme)
  const [scriptLen, setScriptLen] = useState(0)
  const [romaVisible, setRomaVisible] = useState(false)
  const scriptTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Split into grapheme clusters for reveal animation
  const segments = useMemo(() => {
    try {
      const seg = new Intl.Segmenter(langCfg.languageCode.split('-')[0], { granularity: 'grapheme' })
      return [...seg.segment(exercise.targetText)].map(s => s.segment)
    } catch {
      return [...exercise.targetText]
    }
  }, [exercise.targetText, langCfg.languageCode])

  // Instruction typewriter — runs once per exercise
  useEffect(() => {
    setInstrLen(0)
    let i = 0
    const t = setInterval(() => {
      i++
      setInstrLen(i)
      if (i >= INSTR.length) clearInterval(t)
    }, 30)
    return () => clearInterval(t)
  }, [exercise.id])

  function revealScript() {
    setScriptLen(0)
    setRomaVisible(false)
    if (scriptTimerRef.current) clearInterval(scriptTimerRef.current)
    let i = 0
    scriptTimerRef.current = setInterval(() => {
      i++
      setScriptLen(i)
      if (i >= segments.length) {
        clearInterval(scriptTimerRef.current!)
        // Romanization fades in after script finishes
        setTimeout(() => setRomaVisible(true), 100)
      }
    }, 60)
  }

  async function playWithReveal(b64: string) {
    setPlaying(true)
    try {
      // Start script reveal shortly after audio begins playing
      setTimeout(() => revealScript(), 250)
      await play(b64)
    } finally {
      setPlaying(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setSelected(null)
    setScriptLen(0)
    setRomaVisible(false)

    tts({ text: exercise.targetText, language_code: langCfg.languageCode, speaker: langCfg.ttsDefaultSpeaker })
      .then((b64) => {
        if (cancelled) return
        setAudioBase64(b64)
        setLoading(false)
        return playWithReveal(b64)
      })
      .catch((e) => { if (!cancelled) { setError(e.message); setLoading(false) } })

    return () => {
      cancelled = true
      if (scriptTimerRef.current) clearInterval(scriptTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id])

  function handleSelect(option: string) {
    if (selected) return
    setSelected(option)
    onResult(option === exercise.englishText)
  }

  const options = exercise.options ?? [exercise.englishText]
  const scriptVisible = segments.slice(0, scriptLen).join('')

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 max-w-md mx-auto w-full">

      {/* Instruction — typewriter, centered */}
      <p className="font-semibold text-center" style={{ fontSize: 17, color: '#6B7280', minHeight: 26 }}>
        {INSTR.slice(0, instrLen)}
      </p>

      {/* Word card — tap to replay, animated border + waveform during playback */}
      <button
        onClick={() => !loading && audioBase64 && playWithReveal(audioBase64)}
        disabled={loading}
        className="w-full rounded-3xl text-center disabled:opacity-60"
        style={{
          background: '#FFFFFF',
          border: playing ? '2px solid #FFC857' : '1.5px solid #EDE8E0',
          boxShadow: playing
            ? '0 0 0 4px rgba(255,200,87,0.18), 0 6px 20px rgba(0,0,0,0.07)'
            : '0 6px 20px rgba(0,0,0,0.07)',
          padding: '24px 24px 20px',
          cursor: loading ? 'default' : 'pointer',
          transition: 'border 0.2s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Waveform / speaker icon in top-right */}
        <div className="flex justify-end mb-2" style={{ height: 24 }}>
          {playing
            ? <WaveformBars color="#FFC857" />
            : <span style={{ color: '#FFC857', fontSize: 18 }}>{loading ? '⏳' : '🔊'}</span>
          }
        </div>

        {/* Script text — reveals grapheme by grapheme after audio plays */}
        <p
          className={`font-bold mb-2 ${langCfg.scriptClass}`}
          style={{ fontSize: 44, color: '#1F3A5F', lineHeight: 1.2, minHeight: 56 }}
        >
          {scriptVisible || <span style={{ opacity: 0.12 }}>•</span>}
        </p>

        {/* Romanization — fades in after script completes */}
        <p style={{
          fontSize: 16, color: '#E07A5F', fontStyle: 'italic',
          opacity: romaVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          minHeight: 24,
        }}>
          [{exercise.romanized}]
        </p>

        <p style={{ fontSize: 12, color: '#C0BAB2', marginTop: 4 }}>
          {loading ? 'loading…' : 'tap to hear again'}
        </p>
      </button>

      {error && (
        <p className="text-sm text-center" style={{ color: '#E07A5F' }}>⚠️ Could not load audio.</p>
      )}

      {/* Answer options — warm idle, indigo for correct, terracotta for wrong */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {options.map((opt) => {
          const isCorrect = opt === exercise.englishText
          const isSelected = opt === selected

          let bg = '#FBF9F6'
          let borderColor = '#E8E2DA'
          let textColor = '#1F2937'

          if (selected) {
            if (isCorrect) {
              bg = '#1F3A5F'; textColor = 'white'; borderColor = '#1F3A5F'
            } else if (isSelected) {
              bg = '#E07A5F'; textColor = 'white'; borderColor = '#E07A5F'
            } else {
              bg = '#F8F5F0'; textColor = '#9CA3AF'; borderColor = '#EDE8E0'
            }
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
              className="py-4 px-3 rounded-2xl font-semibold text-base shadow-sm border-2 transition-all active:scale-95"
              style={{ background: bg, color: textColor, borderColor, cursor: selected ? 'default' : 'pointer' }}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Inline feedback — appears after selection */}
      {selected && (() => {
        const isCorrect = selected === exercise.englishText
        return (
          <div
            className="w-full rounded-2xl px-4 py-3 flex items-center gap-3"
            style={{
              background: isCorrect ? '#EFF4EF' : '#FEF3EE',
              border: `1.5px solid ${isCorrect ? '#C4D6C4' : '#F0C4B4'}`,
            }}
          >
            <span style={{ fontSize: 22 }}>{isCorrect ? '✅' : '❌'}</span>
            <div>
              <p className="font-bold text-sm" style={{ color: isCorrect ? '#4A7459' : '#E07A5F' }}>
                {isCorrect ? '🎉 Correct!' : 'Not quite…'}
              </p>
              {!isCorrect && (
                <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
                  Answer: <span className={`font-bold ${langCfg.scriptClass}`} style={{ color: '#1F3A5F' }}>{exercise.targetText}</span>
                </p>
              )}
            </div>
          </div>
        )
      })()}

      {/* Continue button */}
      {selected && (
        <button
          onClick={() => onResult(selected === exercise.englishText)}
          className="w-full font-bold text-white active:scale-95 transition-transform"
          style={{
            height: 52, borderRadius: 16, fontSize: 17, border: 'none',
            background: selected === exercise.englishText
              ? 'linear-gradient(135deg,#4A7459,#7A9E82)'
              : '#FF7A00',
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
