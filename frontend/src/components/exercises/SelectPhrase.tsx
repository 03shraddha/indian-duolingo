import { useState } from 'react'
import type { Exercise, LanguageConfig } from '../../types'

interface Props {
  exercise: Exercise
  langCfg: LanguageConfig
  onResult: (correct: boolean) => void
}

export default function SelectPhrase({ exercise, langCfg, onResult }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(option: string) {
    if (selected) return
    setSelected(option)
    // Don't advance yet — let the user read the feedback, then click Continue
  }

  const options = exercise.options ?? [exercise.targetText]
  const isCorrect = selected === exercise.targetText

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-5 px-3 sm:px-4 py-5 sm:py-6 max-w-md mx-auto w-full">

      {/* Instruction */}
      <p className="font-semibold text-center text-sm sm:text-base" style={{ color: '#6B7280' }}>
        select the correct phrase
      </p>

      {/* English prompt card */}
      <div
        className="w-full rounded-3xl text-center"
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #EDE8E0',
          boxShadow: '0 6px 20px rgba(0,0,0,0.07)',
          padding: 'clamp(16px, 4vw, 26px) clamp(14px, 4vw, 24px)',
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#9CA3AF' }}>
          which phrase means
        </p>
        <p className="font-bold" style={{ fontSize: 'clamp(19px, 5.5vw, 26px)', color: '#1F3A5F' }}>
          "{exercise.englishText}"
        </p>
      </div>

      {/* Option grid — 2 columns, target language script */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
        {options.map((opt) => {
          const isOptCorrect = opt === exercise.targetText
          const isSelected = opt === selected

          let bg = '#FBF9F6'
          let borderColor = '#E8E2DA'
          let textColor = '#1F3A5F'
          let opacity = 1

          if (selected) {
            if (isOptCorrect) {
              bg = '#1F3A5F'; textColor = '#FFFFFF'; borderColor = '#1F3A5F'
            } else if (isSelected) {
              bg = '#E07A5F'; textColor = '#FFFFFF'; borderColor = '#E07A5F'
            } else {
              opacity = 0.38
            }
          }

          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={!!selected}
              className={`py-4 sm:py-5 px-3 rounded-2xl font-bold border-2 shadow-sm transition-all active:scale-95 ${langCfg.scriptClass}`}
              style={{
                background: bg,
                color: textColor,
                borderColor,
                opacity,
                fontSize: 'clamp(14px, 4vw, 19px)',
                lineHeight: 1.35,
                cursor: selected ? 'default' : 'pointer',
                minHeight: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {opt}
            </button>
          )
        })}
      </div>

      {/* Inline feedback — shows target + romanized after any selection */}
      {selected && (
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
            <p className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
              <span className={`font-bold ${langCfg.scriptClass}`} style={{ color: '#1F3A5F' }}>
                {exercise.targetText}
              </span>
              {' '}— {exercise.romanized}
            </p>
          </div>
        </div>
      )}

      {/* Continue button */}
      {selected && (
        <button
          onClick={() => onResult(isCorrect)}
          className="w-full font-bold text-white active:scale-95 transition-transform"
          style={{
            height: 52, borderRadius: 16, fontSize: 17, border: 'none',
            background: isCorrect
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
