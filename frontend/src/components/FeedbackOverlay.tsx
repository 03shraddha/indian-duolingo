interface FeedbackOverlayProps {
  result: 'correct' | 'incorrect' | null
  correctAnswer: string     // shown on incorrect
  onContinue: () => void
}

export default function FeedbackOverlay({ result, correctAnswer, onContinue }: FeedbackOverlayProps) {
  if (!result) return null

  const isCorrect = result === 'correct'

  return (
    <div
      className="fixed bottom-0 left-0 right-0 slide-up z-50 px-4 pt-6 pb-8 shadow-2xl"
      style={{
        background: isCorrect ? '#00A896' : '#C85C3A',
        borderRadius: '24px 24px 0 0',
      }}
    >
      <div className="max-w-lg mx-auto">
        {/* Icon + heading */}
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl bounce-in">{isCorrect ? '✅' : '❌'}</span>
          <h2 className="text-2xl font-extrabold text-white">
            {isCorrect ? 'शाबाश! Well done!' : 'Not quite…'}
          </h2>
        </div>

        {/* Correct answer on failure */}
        {!isCorrect && (
          <p className="text-white text-base mb-4 opacity-90">
            Correct answer:{' '}
            <span className="font-bold devanagari text-lg">{correctAnswer}</span>
          </p>
        )}

        {isCorrect && (
          <p className="text-white text-base mb-4 opacity-90">Keep it up! 🎉</p>
        )}

        {/* Continue button */}
        <button
          onClick={onContinue}
          className="w-full py-4 rounded-2xl font-bold text-lg shadow active:scale-95 transition-transform"
          style={{
            background: 'white',
            color: isCorrect ? '#00A896' : '#C85C3A',
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
