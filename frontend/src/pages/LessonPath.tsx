import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { units } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'

export default function LessonPath() {
  const navigate = useNavigate()
  const { isCompleted } = useProgress()

  // A lesson is unlocked if it is the first lesson of the first unit,
  // OR if the previous lesson is completed.
  const allLessons = units.flatMap((u) => u.lessons)

  function isUnlocked(lessonId: string): boolean {
    const idx = allLessons.findIndex((l) => l.id === lessonId)
    if (idx === 0) return true
    return isCompleted(allLessons[idx - 1].id)
  }

  return (
    <div className="min-h-screen" style={{ background: '#FFF8F0' }}>
      <Header />

      <main className="max-w-lg mx-auto px-4 py-6 pb-24">
        <h2 className="text-2xl font-extrabold mb-6" style={{ color: '#1E3A5F' }}>
          Your Learning Path
        </h2>

        {units.map((unit, uIdx) => (
          <section key={unit.id} className="mb-8">
            {/* Unit header */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-4 shadow-sm"
              style={{ background: '#1E3A5F' }}
            >
              <span className="text-3xl">{unit.emoji}</span>
              <div>
                <p className="text-xs font-semibold text-white opacity-60 uppercase tracking-widest">
                  Unit {uIdx + 1}
                </p>
                <p className="text-lg font-bold text-white">{unit.title}</p>
              </div>
            </div>

            {/* Lesson nodes */}
            <div className="flex flex-col items-center gap-3">
              {unit.lessons.map((lesson, lIdx) => {
                const done = isCompleted(lesson.id)
                const unlocked = isUnlocked(lesson.id)

                return (
                  <div key={lesson.id} className="relative w-full flex flex-col items-center">
                    {/* Connector line (skip for first lesson of unit) */}
                    {lIdx > 0 && (
                      <div
                        className="w-1 h-6 -mt-3 mb-1 rounded-full"
                        style={{ background: done ? '#FF6B00' : '#FFB800', opacity: 0.5 }}
                      />
                    )}

                    <button
                      onClick={() => unlocked && navigate(`/exercise/${lesson.id}`)}
                      disabled={!unlocked}
                      className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl shadow-sm border-2 transition-all active:scale-95 disabled:cursor-not-allowed"
                      style={{
                        background: done ? '#FFF3E0' : unlocked ? 'white' : '#F5F5F5',
                        borderColor: done ? '#FF6B00' : unlocked ? '#FFB800' : '#E0E0E0',
                        opacity: unlocked ? 1 : 0.55,
                      }}
                    >
                      {/* Status icon */}
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 shadow"
                        style={{
                          background: done
                            ? 'linear-gradient(135deg, #FF6B00, #FFB800)'
                            : unlocked
                            ? '#FFF3E0'
                            : '#EEEEEE',
                        }}
                      >
                        {done ? '✅' : unlocked ? '▶️' : '🔒'}
                      </div>

                      {/* Lesson info */}
                      <div className="text-left flex-1">
                        <p
                          className="text-xs uppercase tracking-wide font-semibold mb-0.5"
                          style={{ color: '#4A4A6A' }}
                        >
                          Lesson {lIdx + 1}
                        </p>
                        <p
                          className="text-base font-bold"
                          style={{ color: '#1A1A2E' }}
                        >
                          {lesson.title}
                        </p>
                        <p className="text-xs" style={{ color: '#4A4A6A' }}>
                          {lesson.exercises.length} exercises
                        </p>
                      </div>

                      {/* XP badge */}
                      {done && (
                        <span
                          className="text-xs font-bold px-2 py-1 rounded-full"
                          style={{ background: '#FF6B00', color: 'white' }}
                        >
                          +10 XP
                        </span>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </main>
    </div>
  )
}
