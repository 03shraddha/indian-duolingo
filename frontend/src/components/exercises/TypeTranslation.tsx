import { useState } from 'react'
import type { Exercise, LanguageConfig } from '../../types'

interface Props {
  exercise: Exercise
  langCfg: LanguageConfig
  onResult: (correct: boolean) => void
}

/** Normalize text for comparison: trim, collapse spaces. */
function normalizeText(s: string): string {
  return s.trim().replace(/\s+/g, ' ')
}

function checkCorrect(userInput: string, expected: string): boolean {
  const u = normalizeText(userInput)
  const e = normalizeText(expected)
  if (u === e) return true
  // Accept stripped spaces too
  return u.replace(/\s/g, '') === e.replace(/\s/g, '')
}

export default function TypeTranslation({ exercise, langCfg, onResult }: Props) {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)

  function handleSubmit() {
    if (!input.trim() || submitted) return
    const result = checkCorrect(input, exercise.targetText)
    setCorrect(result)
    setSubmitted(true)
  }

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6 max-w-md mx-auto w-full">
      {/* Instruction */}
      <p className="font-semibold" style={{ fontSize: 17, color: '#6B7280' }}>
        ✍️ type the translation
      </p>

      {/* English phrase — indigo card instead of heavy gradient */}
      <div
        className="w-full rounded-3xl p-6 text-center shadow-sm"
        style={{ background: '#1F3A5F' }}
      >
        <p className="text-3xl font-extrabold text-white">{exercise.englishText}</p>
      </div>

      {/* Romanized hint — muted terracotta */}
      <p className="text-sm italic" style={{ color: '#E07A5F' }}>
        Hint: {exercise.romanized}
      </p>

      {/* Text input */}
      <div className="w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Type the phrase..."
          disabled={submitted}
          className={`w-full text-2xl text-center py-4 px-4 rounded-2xl border-2 outline-none transition-colors ${langCfg.scriptClass}`}
          style={{
            borderColor: submitted ? (correct ? '#00A896' : '#E07A5F') : '#EDE8E0',
            background: submitted ? (correct ? '#E8F8F5' : '#FEF3EE') : 'white',
            color: '#1F2937',
          }}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      {/* Show correct answer on wrong */}
      {submitted && !correct && (
        <p className="text-sm text-center" style={{ color: '#6B7280' }}>
          Correct:{' '}
          <span className={`font-bold text-lg ${langCfg.scriptClass}`} style={{ color: '#1F3A5F' }}>
            {exercise.targetText}
          </span>
        </p>
      )}

      {/* Submit / Continue button */}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white shadow active:scale-95 transition-transform disabled:opacity-40"
          style={{ background: '#FF7A00', border: 'none', cursor: input.trim() ? 'pointer' : 'default' }}
        >
          Check Answer
        </button>
      ) : (
        <button
          onClick={() => onResult(correct)}
          className="w-full font-bold text-white active:scale-95 transition-transform"
          style={{
            height: 52, borderRadius: 16, fontSize: 17, border: 'none',
            background: correct ? 'linear-gradient(135deg,#4A7459,#7A9E82)' : '#FF7A00',
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
