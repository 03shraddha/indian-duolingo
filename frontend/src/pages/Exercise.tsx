import { useState, useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import ProgressBar from '../components/ProgressBar'
import FeedbackOverlay from '../components/FeedbackOverlay'
import ListenIdentify from '../components/exercises/ListenIdentify'
import SpeakRepeat from '../components/exercises/SpeakRepeat'
import TypeTranslation from '../components/exercises/TypeTranslation'
import { getLessonById } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import { useLanguage } from '../hooks/useLanguage'
import { LANGUAGE_CONFIG } from '../types'
import type { Exercise as ExerciseType, Language } from '../types'

export default function Exercise() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const { language } = useLanguage()

  useEffect(() => {
    if (!language) navigate('/', { replace: true })
  }, [language, navigate])

  const activeLang = (language ?? 'hindi') as Language
  const langCfg = LANGUAGE_CONFIG[activeLang]
  const { completeLesson } = useProgress(activeLang)

  const lesson = lessonId ? getLessonById(lessonId, activeLang) : null

  const [currentIdx, setCurrentIdx] = useState(0)
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
      completeLesson(lesson.id)
      setFinished(true)
    } else {
      setCurrentIdx(nextIdx)
    }
  }

  // ── Not found ──────────────────────────────────────────────────────────────
  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#F8F5F0' }}>
        <p className="text-6xl">🤔</p>
        <p className="text-xl font-bold" style={{ color: '#1F3A5F' }}>Lesson not found</p>
        <button onClick={() => navigate('/learn')} className="px-6 py-3 rounded-2xl font-bold text-white"
          style={{ background: '#FF7A00', border: 'none', cursor: 'pointer' }}>
          Back to lessons
        </button>
      </div>
    )
  }

  // ── Lesson complete screen ─────────────────────────────────────────────────
  if (finished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-6 text-center"
        style={{ background: '#F8F5F0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: 'linear-gradient(90deg,#FFC857,#FF7A00,#FFC857)' }} />
        <span className="text-8xl bounce-in">🎉</span>
        <h2 className="text-4xl font-extrabold" style={{ color: '#1F3A5F' }}>Lesson Complete!</h2>
        <p className={`text-2xl font-bold ${langCfg.scriptClass}`} style={{ color: '#FF7A00' }}>
          {langCfg.wellDoneText}
        </p>
        <div className="px-6 py-3 rounded-2xl font-bold text-xl shadow-sm"
          style={{ background: '#FFF3E6', color: '#FF7A00', border: '1.5px solid #FFD3A3' }}>
          +10 XP earned ⭐
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={() => navigate('/learn')}
            className="px-6 py-4 rounded-2xl font-bold text-white shadow active:scale-95 transition-transform"
            style={{ background: '#1F3A5F', border: 'none', cursor: 'pointer' }}>
            ← All Lessons
          </button>
          <button onClick={() => { setCurrentIdx(0); setFinished(false); setFeedback(null) }}
            className="px-6 py-4 rounded-2xl font-bold shadow active:scale-95 transition-transform"
            style={{ background: '#FFFFFF', color: '#1F3A5F', border: '1.5px solid #EDE8E0', cursor: 'pointer' }}>
            Practice Again 🔄
          </button>
        </div>
      </div>
    )
  }

  // ── Active exercise ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8F5F0' }}>
      <Header showBack />
      <ProgressBar current={currentIdx} total={lesson.exercises.length} />
      <div className="px-4 pt-2 pb-1">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
          {lesson.title}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {exercise && exercise.type === 'listen-identify' && (
          <ListenIdentify key={exercise.id} exercise={exercise} langCfg={langCfg} onResult={handleResult} />
        )}
        {exercise && exercise.type === 'speak-repeat' && (
          <SpeakRepeat key={exercise.id} exercise={exercise} langCfg={langCfg} onResult={handleContinue} />
        )}
        {exercise && exercise.type === 'type-translation' && (
          <TypeTranslation key={exercise.id} exercise={exercise} langCfg={langCfg} onResult={handleResult} />
        )}
      </div>
      <FeedbackOverlay
        result={feedback}
        correctAnswer={exercise?.targetText ?? ''}
        scriptClass={langCfg.scriptClass}
        wellDoneText={langCfg.wellDoneText}
        onContinue={handleContinue}
      />
    </div>
  )
}
