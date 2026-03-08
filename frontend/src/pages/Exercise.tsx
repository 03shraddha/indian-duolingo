import { useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import ProgressBar from '../components/ProgressBar'
import FeedbackOverlay from '../components/FeedbackOverlay'
import ListenIdentify from '../components/exercises/ListenIdentify'
import SpeakRepeat from '../components/exercises/SpeakRepeat'
import TypeTranslation from '../components/exercises/TypeTranslation'
import { getLessonById } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import type { Exercise as ExerciseType } from '../types'

export default function Exercise() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { completeLesson } = useProgress()

  const lesson = lessonId ? getLessonById(lessonId) : null

  const [currentIdx, setCurrentIdx] = useState(0)
  // feedback: null = no overlay, 'correct' | 'incorrect' = show overlay
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [finished, setFinished] = useState(false)

  const exercise: ExerciseType | undefined = lesson?.exercises[currentIdx]

  const handleResult = useCallback((correct: boolean) => {
    setFeedback(correct ? 'correct' : 'incorrect')
  }, [])

  function handleContinue() {
    setFeedback(null)

    if (!lesson) return
    const nextIdx = currentIdx + 1

    if (nextIdx >= lesson.exercises.length) {
      // Lesson complete
      completeLesson(lesson.id)
      setFinished(true)
    } else {
      setCurrentIdx(nextIdx)
    }
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#FFF8F0' }}>
        <p className="text-6xl">🤔</p>
        <p className="text-xl font-bold" style={{ color: '#1E3A5F' }}>Lesson not found</p>
        <button
          onClick={() => navigate('/learn')}
          className="px-6 py-3 rounded-2xl font-bold text-white"
          style={{ background: '#FF6B00' }}
        >
          Back to lessons
        </button>
      </div>
    )
  }

  // ── Lesson complete screen ────────────────────────────────────────────────
  if (finished) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #FFF8F0, #FFF3E0)' }}
      >
        <span className="text-8xl bounce-in">🎉</span>
        <h2 className="text-4xl font-extrabold" style={{ color: '#1E3A5F' }}>
          Lesson Complete!
        </h2>
        <p className="devanagari text-2xl font-bold" style={{ color: '#FF6B00' }}>
          शाबाश!
        </p>
        <div
          className="px-6 py-3 rounded-2xl font-bold text-2xl text-white shadow-lg"
          style={{ background: 'linear-gradient(135deg, #FF6B00, #FFB800)' }}
        >
          +10 XP earned ⭐
        </div>
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => navigate('/learn')}
            className="px-6 py-4 rounded-2xl font-bold text-white shadow active:scale-95 transition-transform"
            style={{ background: '#1E3A5F' }}
          >
            ← All Lessons
          </button>
          <button
            onClick={() => {
              setCurrentIdx(0)
              setFinished(false)
              setFeedback(null)
            }}
            className="px-6 py-4 rounded-2xl font-bold text-white shadow active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #FF6B00, #FFB800)' }}
          >
            Practice Again 🔄
          </button>
        </div>
      </div>
    )
  }

  // ── Active exercise ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FFF8F0' }}>
      <Header showBack />

      {/* Progress bar */}
      <ProgressBar current={currentIdx} total={lesson.exercises.length} />

      {/* Lesson title */}
      <div className="px-4 pt-2 pb-1">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#4A4A6A' }}>
          {lesson.title}
        </p>
      </div>

      {/* Exercise content — re-mount on index change via key */}
      <div className="flex-1 overflow-y-auto">
        {exercise && exercise.type === 'listen-identify' && (
          <ListenIdentify key={exercise.id} exercise={exercise} onResult={handleResult} />
        )}
        {exercise && exercise.type === 'speak-repeat' && (
          <SpeakRepeat key={exercise.id} exercise={exercise} onResult={handleContinue} />
        )}
        {exercise && exercise.type === 'type-translation' && (
          <TypeTranslation key={exercise.id} exercise={exercise} onResult={handleResult} />
        )}
      </div>

      {/* Feedback overlay (slides up from bottom) */}
      <FeedbackOverlay
        result={feedback}
        correctAnswer={exercise?.hindiText ?? ''}
        onContinue={handleContinue}
      />
    </div>
  )
}
