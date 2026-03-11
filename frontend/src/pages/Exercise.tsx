import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'
import ProgressBar from '../components/ProgressBar'
import ListenIdentify from '../components/exercises/ListenIdentify'
import SpeakRepeat from '../components/exercises/SpeakRepeat'
import SelectPhrase from '../components/exercises/SelectPhrase'
import { getLessonById } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import { useLanguage } from '../hooks/useLanguage'
import { LANGUAGE_CONFIG } from '../types'
import { prefetchTTSStream } from '../api/sarvam'
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

  // Sort exercises so listen-identify comes first, speak-repeat last.
  // This keeps fast interactions at the front and voice recording at the end,
  // reducing perceived latency while the user warms up with the content.
  const TYPE_ORDER: Record<string, number> = { 'listen-identify': 0, 'type-translation': 1, 'speak-repeat': 2 }
  const exercises = useMemo(
    () => lesson ? [...lesson.exercises].sort((a, b) => (TYPE_ORDER[a.type] ?? 3) - (TYPE_ORDER[b.type] ?? 3)) : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lesson?.id],
  )

  const [currentIdx, setCurrentIdx] = useState(0)
  const [finished, setFinished] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Reset scroll position to top whenever the exercise changes
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 })
  }, [currentIdx])

  const exercise: ExerciseType | undefined = exercises[currentIdx]

  // Prefetch ALL exercises in the lesson the moment it loads — fires in parallel
  // while the user is on exercise 1, so exercises 2-N play from cache instantly.
  useEffect(() => {
    if (!lesson) return
    const opts = { language_code: langCfg.languageCode, speaker: langCfg.ttsDefaultSpeaker }
    for (const ex of exercises) {
      if (ex.type === 'listen-identify') {
        prefetchTTSStream({ text: ex.targetText, ...opts })
      } else if (ex.type === 'speak-repeat') {
        prefetchTTSStream({ text: ex.targetText, ...opts, pace: 1.0 })
        prefetchTTSStream({ text: ex.targetText, ...opts, pace: 0.7 })
      }
    }
  }, [lesson?.id, langCfg])

  // Also keep a single-ahead prefetch as a safety net (no-op on cache hits)
  useEffect(() => {
    if (!lesson) return
    const next = exercises[currentIdx + 1]
    if (!next) return
    const opts = { language_code: langCfg.languageCode, speaker: langCfg.ttsDefaultSpeaker }
    if (next.type === 'listen-identify') {
      prefetchTTSStream({ text: next.targetText, ...opts })
    } else if (next.type === 'speak-repeat') {
      prefetchTTSStream({ text: next.targetText, ...opts, pace: 1.0 })
      prefetchTTSStream({ text: next.targetText, ...opts, pace: 0.7 })
    }
  }, [currentIdx, lesson, langCfg])

  // Called by exercises when done — always awards XP on the final exercise
  function handleResult() {
    if (!lesson) return
    const nextIdx = currentIdx + 1
    if (nextIdx >= exercises.length) {
      completeLesson(lesson.id)
      setFinished(true)
    } else {
      setCurrentIdx(nextIdx)
    }
  }

  // Called by the Skip button — advances without awarding XP
  function handleSkip() {
    if (!lesson) return
    const nextIdx = currentIdx + 1
    if (nextIdx >= exercises.length) {
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
        <span className="text-6xl sm:text-8xl bounce-in">🎉</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: '#1F3A5F' }}>Lesson Complete!</h2>
        <p className={`text-xl sm:text-2xl font-bold ${langCfg.scriptClass}`} style={{ color: '#FF7A00' }}>
          {langCfg.wellDoneText}
        </p>
        <div className="px-5 py-3 rounded-2xl font-bold text-lg sm:text-xl shadow-sm"
          style={{ background: '#EFF4EF', color: '#4A7459', border: '1.5px solid #C4D6C4' }}>
          +10 XP earned ⭐
        </div>
        <div className="flex gap-2 sm:gap-3 mt-4 w-full max-w-xs">
          <button onClick={() => navigate('/learn')}
            className="flex-1 px-4 py-3 sm:py-4 rounded-2xl font-bold text-white shadow active:scale-95 transition-transform text-sm sm:text-base"
            style={{ background: '#1F3A5F', border: 'none', cursor: 'pointer' }}>
            ← All Lessons
          </button>
          <button onClick={() => { setCurrentIdx(0); setFinished(false) }}
            className="flex-1 px-4 py-3 sm:py-4 rounded-2xl font-bold shadow active:scale-95 transition-transform text-sm sm:text-base"
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
      <Header showBack onBack={() => setShowExitModal(true)} />
      {showExitModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(31,58,95,0.45)', backdropFilter: 'blur(2px)' }}
        >
          <div className="w-full max-w-sm rounded-3xl p-6 flex flex-col gap-4 shadow-2xl"
            style={{ background: '#FFFFFF' }}>
            <h2 className="text-xl font-extrabold text-center" style={{ color: '#1F3A5F' }}>
              Leave this lesson?
            </h2>
            <p className="text-sm text-center" style={{ color: '#9CA3AF' }}>
              Your progress in this lesson will not be saved.
            </p>
            <div className="flex flex-col gap-3 mt-2">
              <button
                onClick={() => { setShowExitModal(false); navigate('/') }}
                className="w-full py-4 rounded-2xl font-bold text-white active:scale-95 transition-transform"
                style={{ background: '#1F3A5F', border: 'none', cursor: 'pointer', fontSize: '1rem' }}
              >
                Change Language
              </button>
              <button
                onClick={() => { setShowExitModal(false); navigate('/home') }}
                className="w-full py-4 rounded-2xl font-bold active:scale-95 transition-transform"
                style={{ background: '#F8F5F0', color: '#1F3A5F', border: '1.5px solid #EDE8E0', cursor: 'pointer', fontSize: '1rem' }}
              >
                Go to Home
              </button>
              <button
                onClick={() => setShowExitModal(false)}
                className="w-full py-3 font-semibold active:opacity-70 transition-opacity"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', fontSize: '0.95rem' }}
              >
                Cancel — keep learning
              </button>
            </div>
          </div>
        </div>
      )}
      <ProgressBar current={currentIdx} total={exercises.length} />
      <div className="px-4 pt-2 pb-1 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#9CA3AF' }}>
          {lesson.title}
        </p>
        <div className="flex items-center gap-3">
          {currentIdx > 0 && (
            <button
              onClick={() => setCurrentIdx(currentIdx - 1)}
              className="text-xs font-semibold"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
            >
              ← prev
            </button>
          )}
          {/* Skip — lets users move past a stuck/buggy exercise without losing flow */}
          <button
            onClick={handleSkip}
            className="text-xs font-semibold"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C0BAB2' }}
          >
            skip →
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {exercise && exercise.type === 'listen-identify' && (
          <ListenIdentify key={exercise.id} exercise={exercise} langCfg={langCfg} onResult={handleResult} />
        )}
        {exercise && exercise.type === 'speak-repeat' && (
          <SpeakRepeat key={exercise.id} exercise={exercise} langCfg={langCfg} onResult={handleResult} />
        )}
        {exercise && exercise.type === 'select-phrase' && (
          <SelectPhrase key={exercise.id} exercise={exercise} langCfg={langCfg} onResult={handleResult} />
        )}
      </div>
    </div>
  )
}
