import { useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'
import { useLanguage } from '../hooks/useLanguage'
import { getAllLessons, lessonsByLanguage } from '../data/lessons'
import { LANGUAGE_CONFIG } from '../types'
import type { Language } from '../types'

/** Circular progress ring showing lesson completion */
function ProgressRing({ pct }: { pct: number }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle cx="60" cy="60" r={r} fill="none" stroke="#EDE8E0" strokeWidth="8" />
        {/* Fill */}
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke="url(#ringGrad)" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#FFC857" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center label */}
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-extrabold" style={{ color: '#1F3A5F', lineHeight: 1 }}>
          {pct}%
        </span>
        <span className="text-xs font-medium mt-0.5" style={{ color: '#9CA3AF' }}>done</span>
      </div>
    </div>
  )
}

/** Thin decorative top accent strip — subtle, not orange-dominant */
function TopAccent() {
  return (
    <div style={{ height: 5, background: '#EDE8E0', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(90deg, transparent 0, transparent 12px, #FFC857 12px, #FFC857 13px)',
        opacity: 0.6,
      }} />
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { language, clearLanguage } = useLanguage()

  // Default to Hindi if somehow we land here without a language set
  const activeLang = (language ?? 'hindi') as Language
  const cfg = LANGUAGE_CONFIG[activeLang]

  const { progress } = useProgress(activeLang)

  const allLessons = getAllLessons(activeLang)
  const units = lessonsByLanguage[activeLang]
  const totalLessons = allLessons.length
  const completedCount = progress.completedLessons.length
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  // Next lesson to do
  const nextLesson = allLessons.find((l) => !progress.completedLessons.includes(l.id))
  const nextUnit = nextLesson ? units.find((u) => u.id === nextLesson.unitId) : null

  const isReturning = completedCount > 0

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F8F5F0' }}>

      {/* Thin decorative top accent strip */}
      <TopAccent />

      {/* Subtle background mandala — 5% opacity */}
      <div
        className="fixed inset-0 pointer-events-none select-none flex items-center justify-center"
        style={{ zIndex: 0 }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 400 400" fill="none" style={{ width: 560, height: 560, opacity: 0.05 }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse key={`a${deg}`} cx="200" cy="55" rx="13" ry="30"
              fill="#1F3A5F" transform={`rotate(${deg} 200 200)`} />
          ))}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse key={`b${deg}`} cx="200" cy="105" rx="9" ry="22"
              fill="#E07A5F" transform={`rotate(${deg} 200 200)`} />
          ))}
          {Array.from({ length: 16 }, (_, i) => i * 22.5).map((deg) => (
            <ellipse key={`c${deg}`} cx="200" cy="148" rx="5" ry="13"
              fill="#FFC857" transform={`rotate(${deg} 200 200)`} />
          ))}
          <circle cx="200" cy="200" r="168" stroke="#1F3A5F" strokeWidth="1.5" strokeDasharray="6 5" />
          <circle cx="200" cy="200" r="128" stroke="#FFC857" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="200" cy="200" r="88"  stroke="#E07A5F" strokeWidth="1" strokeDasharray="3 4" />
          <circle cx="200" cy="200" r="52"  stroke="#1F3A5F" strokeWidth="1.5" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <ellipse key={`d${deg}`} cx="200" cy="167" rx="8" ry="15"
              fill="#E07A5F" opacity="0.6" transform={`rotate(${deg} 200 200)`} />
          ))}
          <circle cx="200" cy="200" r="20" fill="#FFC857" opacity="0.5" />
          <circle cx="200" cy="200" r="8"  fill="#1F3A5F" opacity="0.3" />
        </svg>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 relative z-10">
        <div className="w-full" style={{ maxWidth: 380 }}>

          {/* Greeting — indigo, not orange */}
          <p className="text-base font-semibold text-center mb-5"
            style={{ color: '#1F3A5F', letterSpacing: '0.02em' }}>
            {isReturning ? `👋 Welcome back!` : `👋 ${cfg.greeting}! Ready for 2 minutes of ${cfg.name}?`}
          </p>

          {/* Progress ring */}
          <div className="flex flex-col items-center mb-4">
            <ProgressRing pct={progressPct} />
            <p className="text-sm mt-2 font-medium" style={{ color: '#9CA3AF' }}>
              {completedCount}/{totalLessons} lessons complete
            </p>
          </div>

          {/* Headline */}
          <h1 className="text-center font-bold mb-2"
            style={{ fontSize: 40, color: '#1F2937', lineHeight: 1.1, letterSpacing: '-0.5px' }}>
            Indian Duolingo
          </h1>

          {/* Language greeting in native script — indigo, not orange */}
          <p className={`font-semibold text-center mb-1 ${cfg.scriptClass}`}
            style={{ fontSize: 22, color: '#1F3A5F' }}>
            {cfg.greeting}
          </p>
          <p className="text-center mb-5" style={{ fontSize: 13, color: '#9CA3AF' }}>
            {cfg.nativeName} · {cfg.name}
          </p>

          {/* Punchy copy */}
          <p className="text-center mb-6" style={{ fontSize: 17, color: '#6B7280', lineHeight: 1.6 }}>
            {cfg.subheading.split('. ').map((part, i, arr) => (
              <span key={i}>
                {part}{i < arr.length - 1 ? '.' : ''}<br />
              </span>
            ))}
          </p>

          {/* Streak badge — orange is appropriate here */}
          {progress.currentStreak > 0 && (
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-3 px-5 py-3 rounded-2xl"
                style={{ background: '#FFF3E6', border: '1px solid #FFD3A3' }}>
                <span style={{ fontSize: 26 }}>🔥</span>
                <div>
                  <p className="font-bold" style={{ fontSize: 15, color: '#FF7A00', lineHeight: 1.2 }}>
                    {progress.currentStreak} Day Streak
                  </p>
                  <p style={{ fontSize: 13, color: '#9CA3AF' }}>
                    +{progress.totalXP} XP earned
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Primary CTA — orange is correct here */}
          <button
            onClick={() => navigate('/learn')}
            className="w-full font-bold text-white active:scale-95 transition-transform"
            style={{
              height: 56,
              borderRadius: 18,
              fontSize: 18,
              background: 'linear-gradient(135deg, #FF7A00 0%, #FFB347 100%)',
              boxShadow: '0 8px 20px rgba(255,122,0,0.22)',
              border: 'none',
              cursor: 'pointer',
              marginBottom: 16,
            }}
          >
            {isReturning ? 'Continue Learning →' : 'Start Learning →'}
          </button>

          {/* Today's Lesson preview */}
          {nextLesson && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-6"
              style={{
                background: '#FFFFFF',
                border: '1px solid #EDE8E0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              }}
            >
              <div className="flex-shrink-0 text-2xl w-10 h-10 flex items-center justify-center rounded-xl"
                style={{ background: '#F8F5F0' }}>
                {nextUnit?.emoji ?? '📖'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                  style={{ color: '#9CA3AF' }}>
                  Up Next
                </p>
                <p className="text-sm font-bold truncate" style={{ color: '#1F2937' }}>
                  {nextLesson.title}
                </p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>
                  {nextLesson.exercises.length} exercises · ~2 minutes
                </p>
              </div>
              {/* Subtle chevron — muted, not orange */}
              <span style={{ color: '#9CA3AF', fontSize: 20 }}>›</span>
            </div>
          )}

          {/* Trust indicators */}
          <div className="flex flex-col gap-2 mb-6">
            {['5 minute lessons', 'No signup required', 'Works in your browser'].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span style={{ color: '#52B788', fontSize: 13 }}>✔</span>
                <span className="text-sm" style={{ color: '#9CA3AF' }}>{t}</span>
              </div>
            ))}
          </div>

          {/* Change language — subtle link */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                clearLanguage()
                navigate('/')
              }}
              className="text-sm font-medium"
              style={{ color: '#9CA3AF', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Change language →
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
