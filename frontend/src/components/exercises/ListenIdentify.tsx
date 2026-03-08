import { useEffect, useState } from 'react'
import { tts } from '../../api/sarvam'
import { useAudio } from '../../hooks/useAudio'
import type { Exercise } from '../../types'

interface Props {
  exercise: Exercise
  onResult: (correct: boolean) => void
}

export default function ListenIdentify({ exercise, onResult }: Props) {
  const { play } = useAudio()
  const [loading, setLoading] = useState(true)
  const [audioBase64, setAudioBase64] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch and play the Hindi TTS audio on mount
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setSelected(null)

    tts({ text: exercise.hindiText, language_code: 'hi-IN' })
      .then((b64) => {
        if (cancelled) return
        setAudioBase64(b64)
        setLoading(false)
        return play(b64)
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise.id])

  function handleSelect(option: string) {
    if (selected) return // already answered
    setSelected(option)
    onResult(option === exercise.englishText)
  }

  const options = exercise.options ?? [exercise.englishText]

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-6 max-w-md mx-auto w-full">
      {/* Instruction */}
      <p className="text-base font-semibold" style={{ color: '#4A4A6A' }}>
        🎧 Listen and choose the correct meaning
      </p>

      {/* Play button */}
      <button
        disabled={loading || !audioBase64}
        onClick={() => audioBase64 && play(audioBase64)}
        className="flex flex-col items-center justify-center w-36 h-36 rounded-full shadow-lg active:scale-95 transition-transform disabled:opacity-50"
        style={{ background: 'linear-gradient(135deg, #1E3A5F, #00A896)' }}
      >
        {loading ? (
          <span className="text-4xl animate-spin">⏳</span>
        ) : (
          <>
            <span className="text-5xl">🔊</span>
            <span className="text-white text-xs mt-1 font-semibold">TAP TO PLAY</span>
          </>
        )}
      </button>

      {/* Romanized hint */}
      <p className="text-base italic" style={{ color: '#C85C3A' }}>
        [{exercise.hindiRomanized}]
      </p>

      {error && (
        <p className="text-sm" style={{ color: '#E74C3C' }}>
          ⚠️ Could not load audio. Check your backend.
        </p>
      )}

      {/* Answer options */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {options.map((opt) => {
          let borderColor = '#FFB800'
          let bg = 'white'
          let textColor = '#1A1A2E'

          if (selected) {
            if (opt === exercise.englishText) {
              bg = '#00A896'
              textColor = 'white'
              borderColor = '#00A896'
            } else if (opt === selected) {
              bg = '#C85C3A'
              textColor = 'white'
              borderColor = '#C85C3A'
            }
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
              className="py-4 px-3 rounded-2xl font-semibold text-base shadow-sm border-2 transition-all active:scale-95"
              style={{ background: bg, color: textColor, borderColor }}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )
}
