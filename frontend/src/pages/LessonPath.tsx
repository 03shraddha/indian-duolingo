import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { units } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import type { Lesson } from '../types'

/** Micro-illustration per lesson title */
const LESSON_ICONS: Record<string, string> = {
  'Hello & Goodbye': '🙏',
  'Yes & No': '🤝',
  'Introductions': '👋',
  'Numbers 1–5': '🔢',
  'Colors': '🎨',
  'Count Objects': '🧮',
  'Common Foods': '🍛',
  'Ordering Food': '☕',
  'Daily Actions': '🌅',
}

function LessonCard({
  lesson,
  lessonNum,
  status,
  isRecommended,
  onClick,
}: {
  lesson: Lesson
  lessonNum: number
  status: 'done' | 'recommended' | 'open'
  isRecommended: boolean
  onClick: () => void
}) {
  const icon = LESSON_ICONS[lesson.title] ?? '📖'

  // Colors by status
  const bg = status === 'done' ? '#F0FAF5' : '#FFFFFF'
  const border = status === 'done'
    ? '2px solid #52B788'
    : isRecommended
    ? '2px solid #FF7A00'
    : '1px solid #EDE8E0'

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 text-left active:scale-98 transition-transform"
      style={{
        background: bg,
        border,
        borderRadius: 18,
        padding: '16px 18px',
        boxShadow: isRecommended
          ? '0 6px 20px rgba(255,122,0,0.15)'
          : '0 4px 12px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Recommended glow stripe */}
      {isRecommended && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          background: 'linear-gradient(180deg, #FF7A00, #FFC857)',
          borderRadius: '18px 0 0 18px',
        }} />
      )}

      {/* Icon circle */}
      <div className="flex-shrink-0 flex items-center justify-center"
        style={{
          width: 52, height: 52, borderRadius: '50%',
          background: status === 'done'
            ? '#E8F5EE'
            : isRecommended
            ? 'linear-gradient(135deg, #FF7A00, #FFC857)'
            : '#F8F5F0',
          fontSize: 24,
        }}>
        {status === 'done' ? '✅' : icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5"
          style={{ color: '#a08878' }}>
          Lesson {lessonNum}
        </p>
        <p className="text-base font-bold truncate"
          style={{ color: '#1F3A5F' }}>
          {lesson.title}
        </p>
        <p className="text-xs mt-0.5" style={{ color: '#9a8a7a' }}>
          {lesson.exercises.length} exercises
        </p>
      </div>

      {/* Right side */}
      <div className="flex-shrink-0 flex flex-col items-end gap-1">
        {status === 'done' && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: '#E8F5EE', color: '#52B788', border: '1px solid #52B788' }}>
            Done
          </span>
        )}
        {isRecommended && status !== 'done' && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
            style={{ background: '#FF7A00' }}>
            Next
          </span>
        )}
        <span style={{ color: '#d0c8c0', fontSize: 18 }}>›</span>
      </div>
    </button>
  )
}

export default function LessonPath() {
  const navigate = useNavigate()
  const { isCompleted, progress } = useProgress()

  const allLessons = units.flatMap((u) => u.lessons)

  // Find recommended: first lesson not yet completed
  const recommendedLesson = allLessons.find((l) => !isCompleted(l.id))

  return (
    <div className="min-h-screen" style={{ background: '#F8F5F0' }}>
      <Header />

      <main className="max-w-lg mx-auto px-4 pt-4 pb-24">

        {/* Recommended banner */}
        {recommendedLesson && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl mb-6"
            style={{ background: '#FFF8EE', border: '1px solid #FFC857' }}>
            <span className="text-lg">⭐</span>
            <p className="text-sm font-semibold" style={{ color: '#FF7A00' }}>
              Recommended next:&nbsp;
              <span style={{ color: '#1F3A5F' }}>{recommendedLesson.title}</span>
            </p>
          </div>
        )}

        {/* XP summary — subtle, bottom-right style */}
        {progress.totalXP > 0 && (
          <div className="flex justify-end mb-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: '#F8F5F0', color: '#a08878', border: '1px solid #EDE8E0' }}>
              ⭐ {progress.totalXP} XP earned
            </span>
          </div>
        )}

        {units.map((unit, uIdx) => {
          let globalLessonIdx = units.slice(0, uIdx).reduce((s, u) => s + u.lessons.length, 0)

          return (
            <section key={unit.id} className="mb-10">

              {/* Unit header — light, no heavy blue */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{unit.emoji}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: '#a08878' }}>
                    Unit {uIdx + 1}
                  </p>
                  <h2 className="text-lg font-extrabold" style={{ color: '#1F3A5F' }}>
                    {unit.title}
                  </h2>
                </div>
                {/* Decorative line */}
                <div className="flex-1 h-px ml-2" style={{ background: '#EDE8E0' }} />
              </div>

              {/* Lessons — vertical path with connecting line */}
              <div className="relative flex flex-col" style={{ gap: 20 }}>
                {/* Vertical path line */}
                <div className="absolute left-7 top-0 bottom-0 w-px"
                  style={{ background: 'linear-gradient(180deg, #FFC857 0%, #EDE8E0 100%)', zIndex: 0 }} />

                {unit.lessons.map((lesson) => {
                  const num = ++globalLessonIdx
                  const done = isCompleted(lesson.id)
                  const recommended = lesson.id === recommendedLesson?.id
                  const status = done ? 'done' : recommended ? 'recommended' : 'open'

                  return (
                    <div key={lesson.id} className="relative" style={{ zIndex: 1 }}>
                      <LessonCard
                        lesson={lesson}
                        lessonNum={num}
                        status={status}
                        isRecommended={recommended}
                        onClick={() => navigate(`/exercise/${lesson.id}`)}
                      />
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </main>
    </div>
  )
}
