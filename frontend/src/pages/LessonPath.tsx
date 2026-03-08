import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { units } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import type { Lesson } from '../types'

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

type LessonStatus = 'done' | 'recommended' | 'available'

function LessonCard({
  lesson,
  lessonNum,
  status,
  onClick,
}: {
  lesson: Lesson
  lessonNum: number
  status: LessonStatus
  onClick: () => void
}) {
  const icon = LESSON_ICONS[lesson.title] ?? '📖'
  const estMins = Math.max(2, Math.round(lesson.exercises.length * 0.4))

  // Per-state styles
  const styles: Record<LessonStatus, {
    bg: string; border: string; iconBg: string; shadow: string
  }> = {
    done: {
      bg: '#F0FAF5',
      border: '1.5px solid #B7E4C7',
      iconBg: '#D8F3DC',
      shadow: '0 4px 12px rgba(82,183,136,0.10)',
    },
    recommended: {
      bg: '#FFFFFF',
      border: '2px solid #FF7A00',
      iconBg: 'linear-gradient(135deg,#FF7A00,#FFC857)',
      shadow: '0 8px 24px rgba(255,122,0,0.14)',
    },
    available: {
      bg: '#FFFFFF',
      border: '1px solid #EDE8E0',
      iconBg: '#F8F5F0',
      shadow: '0 4px 12px rgba(0,0,0,0.04)',
    },
  }
  const s = styles[status]

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 text-left group"
      style={{
        background: s.bg,
        border: s.border,
        borderRadius: 18,
        padding: '18px 18px',
        boxShadow: s.shadow,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
        ;(e.currentTarget as HTMLElement).style.boxShadow =
          status === 'recommended'
            ? '0 12px 28px rgba(255,122,0,0.22)'
            : '0 8px 20px rgba(0,0,0,0.09)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = s.shadow
      }}
    >
      {/* Left accent stripe for recommended */}
      {status === 'recommended' && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 5,
          background: 'linear-gradient(180deg,#FF7A00,#FFC857)',
          borderRadius: '18px 0 0 18px',
        }} />
      )}

      {/* Icon */}
      <div className="flex-shrink-0 flex items-center justify-center text-2xl"
        style={{
          width: 50, height: 50, borderRadius: 14,
          background: s.iconBg,
          marginLeft: status === 'recommended' ? 4 : 0,
        }}>
        {status === 'done' ? '✅' : icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5"
          style={{ color: '#b0a090' }}>
          Lesson {lessonNum}
        </p>
        <p className="text-base font-bold truncate" style={{ color: '#1F2937' }}>
          {lesson.title}
        </p>
        <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
          {lesson.exercises.length} exercises · ~{estMins} min
        </p>
      </div>

      {/* Right badges */}
      <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
        {status === 'done' && (
          <>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{ background: '#D8F3DC', color: '#52B788', border: '1px solid #B7E4C7' }}>
              Done ✓
            </span>
            <span className="text-xs" style={{ color: '#B7E4C7' }}>+10 XP</span>
          </>
        )}
        {status === 'recommended' && (
          <span className="text-xs font-bold px-3 py-1 rounded-full text-white"
            style={{ background: 'linear-gradient(135deg,#FF7A00,#FFC857)' }}>
            Next →
          </span>
        )}
        {status === 'available' && (
          <span style={{ color: '#D0C8C0', fontSize: 20, lineHeight: 1 }}>›</span>
        )}
      </div>
    </button>
  )
}

/** Small unit progress bar */
function UnitProgress({ total, done }: { total: number; done: number }) {
  const pct = total > 0 ? (done / total) * 100 : 0
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#EDE8E0' }}>
        <div className="h-full rounded-full progress-fill"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#FF7A00,#FFC857)' }} />
      </div>
      <span className="text-xs font-semibold" style={{ color: '#b0a090', whiteSpace: 'nowrap' }}>
        {done}/{total}
      </span>
    </div>
  )
}

export default function LessonPath() {
  const navigate = useNavigate()
  const { isCompleted } = useProgress()

  const allLessons = units.flatMap((u) => u.lessons)
  const recommendedLesson = allLessons.find((l) => !isCompleted(l.id))

  return (
    <div className="min-h-screen" style={{ background: '#F8F5F0' }}>
      <Header />

      <main className="max-w-lg mx-auto px-4 pt-6 pb-28">

        {units.map((unit, uIdx) => {
          let globalNum = units.slice(0, uIdx).reduce((s, u) => s + u.lessons.length, 0)
          const unitDone = unit.lessons.filter((l) => isCompleted(l.id)).length

          return (
            <section key={unit.id} className="mb-10">

              {/* Unit header */}
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{unit.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: '#b0a090' }}>
                    Unit {uIdx + 1}
                  </p>
                  <h2 className="text-lg font-extrabold" style={{ color: '#1F3A5F' }}>
                    {unit.title}
                  </h2>
                </div>
              </div>

              {/* Unit progress bar */}
              <div className="mb-5">
                <UnitProgress total={unit.lessons.length} done={unitDone} />
              </div>

              {/* Lessons */}
              <div className="flex flex-col" style={{ gap: 16 }}>
                {unit.lessons.map((lesson) => {
                  const num = ++globalNum
                  const done = isCompleted(lesson.id)
                  const recommended = lesson.id === recommendedLesson?.id
                  const status: LessonStatus = done ? 'done' : recommended ? 'recommended' : 'available'

                  return (
                    <div key={lesson.id}>
                      {/* Recommended banner — sits directly above the card */}
                      {recommended && (
                        <div
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-2"
                          style={{
                            background: 'linear-gradient(90deg,#FFF3E0,#FFF8EE)',
                            border: '1px solid #FFD3A3',
                          }}
                        >
                          <span>⭐</span>
                          <p className="text-sm font-bold" style={{ color: '#FF7A00' }}>
                            Recommended next
                          </p>
                          <div className="flex-1 h-px mx-1" style={{ background: '#FFD3A3' }} />
                          <span className="text-xs" style={{ color: '#FFC857' }}>↓</span>
                        </div>
                      )}

                      <LessonCard
                        lesson={lesson}
                        lessonNum={num}
                        status={status}
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
