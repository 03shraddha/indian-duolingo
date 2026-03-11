import { useEffect, useState, useMemo, useRef } from 'react'
import { useAudio } from '../../hooks/useAudio'
import type { Exercise, LanguageConfig } from '../../types'
import type { TTSOptions } from '../../api/sarvam'

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

/** Derive a short contextual hint from the English text.
 *  Must NOT give away the answer — just narrow the category. */
function getHint(text: string): string | null {
  const t = text.toLowerCase()
  if (t === 'yes') return 'agreement'
  if (t === 'no') return 'refusal'
  if (t.includes('hello') || t.includes('greet')) return 'a greeting'
  if (t.includes('thank')) return 'showing gratitude'
  if (t.includes('sorry') || t.includes('excuse me')) return 'an apology'
  if (t.includes('how are you')) return 'asking about wellbeing'
  if (t.includes('my name')) return 'introducing yourself'
  if (t.includes('ok') || t === 'ok / fine') return 'mild acceptance'
  if (t.includes('no problem') || t.includes('not at all')) return 'putting someone at ease'
  if (t.includes("don't understand")) return 'struggling to follow'
  if (t.includes('how much') || t.includes('cost') || t.includes('price')) return 'about the price'
  if (t.includes('need help') || t.includes('want help')) return 'asking for assistance'
  if (t.includes("don't need") || t.includes('no need')) return 'declining an offer'
  if (t.includes("don't have time") || t.includes('no time')) return 'about being busy'
  if (t.includes('coming') && t.includes('minute')) return 'about timing'
  if (t.includes('understood') || t === 'i see') return 'after listening to someone'
  if (t.includes('where are you going')) return 'asking about destination'
  if (t.includes('did you eat') || t.includes('have you eaten')) return 'checking on someone'
  if (t.includes('how was') || t.includes("how's")) return 'asking for an update'
  if (t.includes('what are you doing')) return 'asking about activity'
  if (t.includes('when will you')) return 'asking about timing'
  if (t.includes('can you')) return 'making a request'
  if (t.includes('please')) return 'a polite request'
  if (t.includes('want to meet') || t.includes('let\'s meet')) return 'making plans'
  if (t.includes('will come') || t.includes("i'll be")) return 'about arriving'
  if (t.includes('very good') || t.includes('well done')) return 'giving praise'
  return null
}

export default function ListenIdentify({ exercise, langCfg, onResult }: Props) {
  const { playStream } = useAudio()
  const [loading, setLoading] = useState(true)
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
        setTimeout(() => setRomaVisible(true), 100)
      }
    }, 60)
  }

  // ttsOpts is stable across renders for this exercise
  const ttsOpts: TTSOptions = {
    text: exercise.targetText,
    language_code: langCfg.languageCode,
    speaker: langCfg.ttsDefaultSpeaker,
  }

  async function playWithReveal() {
    setPlaying(true)
    try {
      // onPlay fires when first chunk is buffered — reveal script at that moment
      await playStream(ttsOpts, () => {
        setLoading(false)
        revealScript()
      })
    } finally {
      // Always unblock the UI — onPlay may not have fired if audio failed
      setLoading(false)
      setPlaying(false)
    }
    // Errors propagate to run() so retry logic fires
  }

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setSelected(null)
    setError(null)      // clear any stale error from the previous exercise
    setScriptLen(0)
    setRomaVisible(false)

    const run = async () => {
      try {
        await playWithReveal()
      } catch {
        if (cancelled) return
        // Retry once after 1.5 s (backend cold-start)
        setTimeout(async () => {
          if (cancelled) return
          try {
            await playWithReveal()
          } catch (retryErr) {
            if (!cancelled) { setError((retryErr as Error).message); setLoading(false) }
          }
        }, 1500)
      }
    }

    run()

    return () => {
      cancelled = true
      if (scriptTimerRef.current) clearInterval(scriptTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id])

  function handleSelect(option: string) {
    if (selected) return
    setSelected(option)
    // Don't advance yet — let the user read the feedback, then click Continue
  }

  const options = exercise.options ?? [exercise.englishText]
  const scriptVisible = segments.slice(0, scriptLen).join('')
  const hint = getHint(exercise.englishText)

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 px-3 sm:px-4 py-5 sm:py-6 max-w-md mx-auto w-full">

      {/* Instruction — typewriter, centered */}
      <p className="font-semibold text-center text-sm sm:text-base" style={{ color: '#6B7280', minHeight: 22 }}>
        {INSTR.slice(0, instrLen)}
      </p>

      {/* Word card — tap to replay, animated border + waveform during playback */}
      <button
        onClick={() => !loading && playWithReveal()}
        disabled={loading}
        className="exercise-card w-full rounded-3xl text-center disabled:opacity-60"
        style={{
          background: '#FFFFFF',
          border: playing ? '2px solid #FFC857' : '1.5px solid #EDE8E0',
          boxShadow: playing
            ? '0 0 0 4px rgba(255,200,87,0.18), 0 6px 20px rgba(0,0,0,0.07)'
            : '0 6px 20px rgba(0,0,0,0.07)',
          padding: 'clamp(14px, 4vw, 24px) clamp(14px, 4vw, 24px) clamp(12px, 3.5vw, 20px)',
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
          style={{ fontSize: 'clamp(28px, 9vw, 44px)', color: '#1F3A5F', lineHeight: 1.2, minHeight: 'clamp(36px, 10vw, 56px)' }}
        >
          {scriptVisible || <span style={{ opacity: 0.12 }}>•</span>}
        </p>

        {/* Romanization — fades in after script completes */}
        <p style={{
          fontSize: 'clamp(13px, 3.5vw, 16px)', color: '#E07A5F', fontStyle: 'italic',
          opacity: romaVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          minHeight: 20,
        }}>
          [{exercise.romanized}]
        </p>

        <p style={{ fontSize: 12, color: '#C0BAB2', marginTop: 4 }}>
          {loading ? 'fetching audio, may take a few seconds…' : 'tap to hear again'}
        </p>

        {/* Contextual hint — shown once romanization is visible, doesn't reveal the answer */}
        {hint && romaVisible && !selected && (
          <p className="text-xs font-medium mt-2" style={{ color: '#A8B5C8' }}>
            💡 {hint}
          </p>
        )}
      </button>

      {/* Error state — show a skip button so the user is never permanently blocked */}
      {error && !selected && (
        <div className="w-full rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
          style={{ background: '#FEF3EE', border: '1.5px solid #F0C4B4' }}>
          <p className="text-sm font-medium" style={{ color: '#E07A5F' }}>⚠️ Audio unavailable</p>
          <button
            onClick={() => onResult(false)}
            className="text-xs font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform flex-shrink-0"
            style={{ background: '#FF7A00', color: '#FFFFFF', border: 'none', cursor: 'pointer' }}
          >
            Skip →
          </button>
        </div>
      )}

      {/* Answer options — warm idle, indigo for correct, terracotta for wrong */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
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
              className="py-3 sm:py-4 px-2 sm:px-3 rounded-2xl font-semibold text-sm sm:text-base shadow-sm border-2 transition-all active:scale-95"
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
