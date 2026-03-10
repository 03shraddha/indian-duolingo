import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Header from '../components/Header'
import { lessonsByLanguage } from '../data/lessons'
import { useProgress } from '../hooks/useProgress'
import { useLanguage } from '../hooks/useLanguage'
import { LANGUAGE_CONFIG } from '../types'
import type { Lesson, Language } from '../types'

const LESSON_ICONS: Record<string, string> = {
  'Hello & Thank You': '🙏',
  'Yes, No & Simple Replies': '🤝',
  'Basic Expressions': '💬',
  'Saying Yes & No': '🤝',
  'Quick Replies': '⚡',
  'Expressing Needs': '🙋',
  'Asking Questions': '❓',
  'Answering Back': '💬',
  'Making Plans': '📅',
  'At a Chai Stall': '☕',
  'At the Market': '🛒',
  'Getting Things Done': '✅',
}

type LessonStatus = 'done' | 'recommended' | 'available'

function LessonCard({ lesson, lessonNum, status, onClick }: {
  lesson: Lesson; lessonNum: number; status: LessonStatus; onClick: () => void
}) {
  const icon = LESSON_ICONS[lesson.title] ?? '📖'
  const estMins = Math.max(2, Math.round(lesson.exercises.length * 0.4))
  const styles: Record<LessonStatus, { bg: string; border: string; iconBg: string; shadow: string }> = {
    done: { bg: '#EFF4EF', border: '1.5px solid #C4D6C4', iconBg: '#D6E9D6', shadow: '0 4px 12px rgba(74,116,89,0.07)' },
    recommended: { bg: '#FFFFFF', border: '2px solid #FF7A00', iconBg: '#FFF3E6', shadow: '0 8px 24px rgba(255,122,0,0.12)' },
    available: { bg: '#FFFFFF', border: '1px solid #EDE8E0', iconBg: '#F8F5F0', shadow: '0 4px 12px rgba(0,0,0,0.04)' },
  }
  const s = styles[status]
  return (
    <button onClick={onClick} className="w-full flex items-center gap-4 text-left"
      style={{ background: s.bg, border: s.border, borderRadius: 18, padding: '18px 18px', boxShadow: s.shadow, transition: 'transform 0.15s ease, box-shadow 0.15s ease', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = status === 'recommended' ? '0 12px 28px rgba(255,122,0,0.18)' : '0 8px 20px rgba(0,0,0,0.08)' }}
      onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = s.shadow }}
    >
      {status === 'recommended' && (
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'linear-gradient(180deg,#FF7A00,#FFC857)', borderRadius: '18px 0 0 18px' }} />
      )}
      <div className="flex-shrink-0 flex items-center justify-center text-2xl"
        style={{ width: 50, height: 50, borderRadius: 14, background: s.iconBg, marginLeft: status === 'recommended' ? 4 : 0 }}>
        {status === 'done' ? '✅' : icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#9CA3AF' }}>Lesson {lessonNum}</p>
        <p className="text-base font-bold truncate" style={{ color: '#1F2937' }}>{lesson.title}</p>
        <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>{lesson.exercises.length} exercises · ~{estMins} min</p>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
        {status === 'done' && (
          <><span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ background: '#D6E9D6', color: '#4A7459', border: '1px solid #C4D6C4' }}>Done ✓</span><span className="text-xs" style={{ color: '#7A9E82' }}>+10 XP</span></>
        )}
        {status === 'recommended' && <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: '#FF7A00' }}>Next →</span>}
        {status === 'available' && <span style={{ color: '#D0C8C0', fontSize: 20, lineHeight: '1' }}>›</span>}
      </div>
    </button>
  )
}

function UnitProgress({ total, done }: { total: number; done: number }) {
  const pct = total > 0 ? (done / total) * 100 : 0
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#EDE8E0' }}>
        <div className="h-full rounded-full progress-fill" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#7A9E82,#4A7459)' }} />
      </div>
      <span className="text-xs font-semibold" style={{ color: '#9CA3AF', whiteSpace: 'nowrap' }}>{done}/{total}</span>
    </div>
  )
}

export default function LessonPath() {
  const navigate = useNavigate()
  const { language } = useLanguage()
  useEffect(() => { if (!language) navigate('/', { replace: true }) }, [language, navigate])
  const activeLang = (language ?? 'hindi') as Language
  const cfg = LANGUAGE_CONFIG[activeLang]
  const units = lessonsByLanguage[activeLang]
  const { isCompleted } = useProgress(activeLang)
  const allLessons = units.flatMap((u) => u.lessons)
  const recommendedLesson = allLessons.find((l) => !isCompleted(l.id))

  return (
    <div className="min-h-screen" style={{ background: '#F8F5F0', position: 'relative' }}>
      {/* Background: script letterform motif */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden="true">
        <span
          className={`absolute font-extrabold ${cfg.scriptClass}`}
          style={{
            fontSize: 'clamp(140px, 45vw, 280px)',
            opacity: 0.035,
            color: '#1F3A5F',
            bottom: '15%',
            left: '-6%',
            lineHeight: 1,
            transform: 'rotate(-8deg)',
            userSelect: 'none',
          }}
        >
          {cfg.nativeName}
        </span>
      </div>
      {/* Faint mandala backdrop — same as Home, 4% opacity */}
      <div className="fixed inset-0 pointer-events-none select-none flex items-center justify-center"
        style={{ zIndex: 0 }} aria-hidden="true">
        <svg viewBox="0 0 400 400" fill="none" style={{ width: 820, height: 820, opacity: 0.04 }}>
          {[0,45,90,135,180,225,270,315].map((deg) => (
            <ellipse key={`a${deg}`} cx="200" cy="55" rx="13" ry="30" fill="#1F3A5F" transform={`rotate(${deg} 200 200)`} />
          ))}
          {[0,45,90,135,180,225,270,315].map((deg) => (
            <ellipse key={`b${deg}`} cx="200" cy="105" rx="9" ry="22" fill="#E07A5F" transform={`rotate(${deg} 200 200)`} />
          ))}
          {Array.from({ length: 16 }, (_, i) => i * 22.5).map((deg) => (
            <ellipse key={`c${deg}`} cx="200" cy="148" rx="5" ry="13" fill="#FFC857" transform={`rotate(${deg} 200 200)`} />
          ))}
          <circle cx="200" cy="200" r="168" stroke="#1F3A5F" strokeWidth="1.5" strokeDasharray="6 5" />
          <circle cx="200" cy="200" r="128" stroke="#FFC857" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="88"  stroke="#E07A5F" strokeWidth="1" strokeDasharray="3 4" />
          <circle cx="200" cy="200" r="52"  stroke="#1F3A5F" strokeWidth="1.5" />
          {[0,45,90,135,180,225,270,315].map((deg) => (
            <ellipse key={`d${deg}`} cx="200" cy="167" rx="8" ry="15" fill="#E07A5F" opacity="0.6" transform={`rotate(${deg} 200 200)`} />
          ))}
          <circle cx="200" cy="200" r="20" fill="#FFC857" opacity="0.5" />
          <circle cx="200" cy="200" r="8"  fill="#1F3A5F" opacity="0.3" />
        </svg>
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
      <Header />
      <main className="max-w-lg mx-auto px-3 sm:px-4 pt-6 pb-28">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: '#9CA3AF' }}>Learning</p>
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 22 }}>{cfg.emoji}</span>
              <h1 className="text-xl font-extrabold" style={{ color: '#1F2937' }}>{cfg.name}</h1>
              <span className={`font-semibold ${cfg.scriptClass}`} style={{ fontSize: 16, color: '#9CA3AF' }}>{cfg.nativeName}</span>
            </div>
          </div>
          <button onClick={() => navigate('/home')} className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: '#F0F0F0', color: '#9CA3AF', border: 'none', cursor: 'pointer' }}>
            ← Home
          </button>
        </div>
        {units.map((unit, uIdx) => {
          let globalNum = units.slice(0, uIdx).reduce((s, u) => s + u.lessons.length, 0)
          const unitDone = unit.lessons.filter((l) => isCompleted(l.id)).length
          return (
            <section key={unit.id} className="mb-10">
              {/* Unit header — sage-light to signal a grouped section */}
              <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-4"
                style={{ background: '#EFF4EF', border: '1px solid #C4D6C4' }}>
                <span className="text-2xl">{unit.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#7A9E82' }}>Unit {uIdx + 1}</p>
                  <h2 className="text-lg font-extrabold" style={{ color: '#4A7459' }}>{unit.title}</h2>
                </div>
              </div>
              <div className="mb-5"><UnitProgress total={unit.lessons.length} done={unitDone} /></div>
              <div className="flex flex-col" style={{ gap: 16 }}>
                {unit.lessons.map((lesson) => {
                  const num = ++globalNum
                  const done = isCompleted(lesson.id)
                  const recommended = lesson.id === recommendedLesson?.id
                  const status: LessonStatus = done ? 'done' : recommended ? 'recommended' : 'available'
                  return (
                    <div key={lesson.id}>
                      {recommended && (
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-2"
                          style={{ background: '#F8F5F0', border: '1px solid #EDE8E0' }}>
                          <span>⭐</span>
                          <p className="text-sm font-bold" style={{ color: '#1F3A5F' }}>Recommended next</p>
                          <div className="flex-1 h-px mx-1" style={{ background: '#EDE8E0' }} />
                          <span className="text-xs" style={{ color: '#9CA3AF' }}>↓</span>
                        </div>
                      )}
                      <LessonCard lesson={lesson} lessonNum={num} status={status} onClick={() => navigate(`/exercise/${lesson.id}`)} />
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </main>
      </div>
    </div>
  )
}
