import { useState } from 'react'
import type { Exercise } from '../../types'

interface Props {
  exercise: Exercise
  onResult: (correct: boolean) => void
}

/** Normalize a Hindi string for comparison: trim, collapse spaces. */
function normalizeHindi(s: string): string {
  return s.trim().replace(/\s+/g, ' ')
}

/** Return true if userInput matches the expected Hindi text (with minor tolerance). */
function isCorrect(userInput: string, expected: string): boolean {
  const u = normalizeHindi(userInput)
  const e = normalizeHindi(expected)
  if (u === e) return true

  // Accept if every character in the expected string is present in order
  // (handles missing spaces or extra vowel marks)
  const stripped = (s: string) => s.replace(/\s/g, '')
  return stripped(u) === stripped(e)
}

export default function TypeTranslation({ exercise, onResult }: Props) {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(false)

  function handleSubmit() {
    if (!input.trim() || submitted) return
    const result = isCorrect(input, exercise.hindiText)
    setCorrect(result)
    setSubmitted(true)
    onResult(result)
  }

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6 max-w-md mx-auto w-full">
      {/* Instruction */}
      <p className="text-base font-semibold" style={{ color: '#4A4A6A' }}>
        ✍️ Type the Hindi translation
      </p>

      {/* English phrase to translate */}
      <div
        className="w-full rounded-3xl p-6 text-center shadow-md"
        style={{ background: 'linear-gradient(135deg, #1E3A5F, #00A896)' }}
      >
        <p className="text-3xl font-extrabold text-white">{exercise.englishText}</p>
      </div>

      {/* Romanized hint */}
      <p className="text-sm italic" style={{ color: '#C85C3A' }}>
        Hint: {exercise.hindiRomanized}
      </p>

      {/* Text input */}
      <div className="w-full">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Type in Hindi (हिंदी में लिखें)"
          disabled={submitted}
          className="w-full devanagari text-2xl text-center py-4 px-4 rounded-2xl border-2 outline-none transition-colors"
          style={{
            borderColor: submitted
              ? correct
                ? '#00A896'
                : '#C85C3A'
              : '#FFB800',
            background: submitted
              ? correct
                ? '#E8F8F5'
                : '#FDECEA'
              : 'white',
            color: '#1A1A2E',
          }}
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
        />
      </div>

      {/* Show correct answer on wrong */}
      {submitted && !correct && (
        <p className="text-sm text-center" style={{ color: '#4A4A6A' }}>
          Correct:{' '}
          <span className="devanagari font-bold text-lg" style={{ color: '#1E3A5F' }}>
            {exercise.hindiText}
          </span>
        </p>
      )}

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white shadow active:scale-95 transition-transform disabled:opacity-40"
          style={{ background: 'linear-gradient(135deg, #FF6B00, #FFB800)' }}
        >
          Check Answer
        </button>
      )}
    </div>
  )
}
