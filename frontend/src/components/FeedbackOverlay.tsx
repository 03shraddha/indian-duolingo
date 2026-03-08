interface FeedbackOverlayProps {
  result: 'correct' | 'incorrect' | null
  correctAnswer: string     // shown on incorrect
  scriptClass: string       // CSS class for the script font (devanagari, kannada-script, etc.)
  wellDoneText: string      // e.g. "शाबाश!" in the target language
  onContinue: () => void
}

export default function FeedbackOverlay({
  result,
  correctAnswer,
  scriptClass,
  wellDoneText,
  onContinue,
}: FeedbackOverlayProps) {
  if (!result) return null

  const isCorrect = result === 'correct'

  return (
    <div
      className="fixed bottom-0 left-0 right-0 slide-up z-50 px-4 pt-5 pb-8 shadow-2xl"
      style={{
        // Correct: turquoise. Incorrect: soft terracotta tint — less harsh than solid red
        background: isCorrect ? '#00A896' : '#FEF3EE',
        borderRadius: '24px 24px 0 0',
        borderTop: isCorrect ? 'none' : '2px solid #F0C4B4',
      }}
    >
      <div className="max-w-lg mx-auto">
        {/* Icon + heading */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl bounce-in">{isCorrect ? '✅' : '❌'}</span>
          <h2 className="text-2xl font-extrabold" style={{ color: isCorrect ? '#FFFFFF' : '#C04A24' }}>
            {isCorrect ? `${wellDoneText} Well done!` : 'Not quite…'}
          </h2>
        </div>

        {/* Correct answer on failure */}
        {!isCorrect && (
          <p className="text-base mb-4" style={{ color: '#7A3B26' }}>
            Correct answer:{' '}
            <span className={`font-bold text-lg ${scriptClass}`} style={{ color: '#1F3A5F' }}>
              {correctAnswer}
            </span>
          </p>
        )}

        {isCorrect && (
          <p className="text-base mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
            Keep it up! 🎉
          </p>
        )}

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-bold text-lg active:scale-95 transition-transform"
          style={{
            background: isCorrect ? 'rgba(255,255,255,0.15)' : '#FF7A00',
            color: '#FFFFFF',
            border: isCorrect ? '2px solid rgba(255,255,255,0.4)' : 'none',
            cursor: 'pointer',
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
