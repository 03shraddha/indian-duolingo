import { useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'

/** Decorative SVG mandala-inspired pattern for the hero section */
function Mandala({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="100" cy="100" r="90" stroke="#FF6B00" strokeWidth="2" strokeDasharray="8 4" />
      <circle cx="100" cy="100" r="70" stroke="#FFB800" strokeWidth="2" strokeDasharray="6 3" />
      <circle cx="100" cy="100" r="50" stroke="#FF6B00" strokeWidth="1.5" strokeDasharray="4 2" />
      <circle cx="100" cy="100" r="30" fill="#FFB800" fillOpacity="0.2" />
      <circle cx="100" cy="100" r="12" fill="#FF6B00" fillOpacity="0.4" />
      {/* Petal decorations */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse
          key={deg}
          cx="100"
          cy="60"
          rx="6"
          ry="14"
          fill="#FFB800"
          fillOpacity="0.5"
          transform={`rotate(${deg} 100 100)`}
        />
      ))}
    </svg>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { progress } = useProgress()

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4"
      style={{ background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 50%, #FFF8F0 100%)' }}
    >
      {/* Background mandala decorations */}
      <Mandala className="absolute -top-16 -left-16 w-64 h-64 opacity-30" />
      <Mandala className="absolute -bottom-16 -right-16 w-80 h-80 opacity-20" />

      {/* Saffron top border stripe */}
      <div
        className="absolute top-0 left-0 right-0 h-1.5"
        style={{ background: 'linear-gradient(90deg, #FF6B00, #FFB800, #FF6B00)' }}
      />

      {/* Hero content */}
      <div className="z-10 text-center max-w-lg w-full">
        {/* App icon / logo */}
        <div className="flex justify-center mb-6">
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-xl"
            style={{ background: 'linear-gradient(135deg, #FF6B00, #FFB800)' }}
          >
            🇮🇳
          </div>
        </div>

        {/* App name */}
        <h1
          className="text-5xl font-extrabold mb-2 tracking-tight"
          style={{ color: '#1E3A5F' }}
        >
          BhaashaPath
        </h1>
        <p className="devanagari text-2xl font-semibold mb-1" style={{ color: '#FF6B00' }}>
          भाषा पाठ
        </p>
        <p className="text-lg mb-10" style={{ color: '#4A4A6A' }}>
          Learn Hindi the Indian way — with voice, heart & culture.
        </p>

        {/* Feature chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { icon: '🎧', label: 'Listen & Learn' },
            { icon: '🎤', label: 'Speak & Repeat' },
            { icon: '✍️', label: 'Type & Translate' },
          ].map(({ icon, label }) => (
            <span
              key={label}
              className="px-4 py-2 rounded-full text-sm font-semibold shadow-sm"
              style={{ background: '#FFF3E0', color: '#C85C3A', border: '1px solid #FFB800' }}
            >
              {icon} {label}
            </span>
          ))}
        </div>

        {/* Streak badge (shown only after first lesson) */}
        {progress.currentStreak > 0 && (
          <div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 font-bold text-white shadow"
            style={{ background: '#FF6B00' }}
          >
            🔥 {progress.currentStreak}-day streak &nbsp;·&nbsp; {progress.totalXP} XP
          </div>
        )}

        {/* CTA button */}
        <button
          onClick={() => navigate('/learn')}
          className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-4 rounded-2xl text-xl font-bold text-white shadow-lg active:scale-95 transition-transform"
          style={{ background: 'linear-gradient(135deg, #FF6B00, #FFB800)' }}
        >
          {progress.completedLessons.length > 0 ? 'Continue Learning' : 'Start Learning'}
          <span className="text-2xl">→</span>
        </button>

        <p className="mt-6 text-sm" style={{ color: '#4A4A6A' }}>
          No account needed · Progress saved in your browser
        </p>
      </div>

      {/* Bottom decorative stripe */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1.5"
        style={{ background: 'linear-gradient(90deg, #1E3A5F, #00A896, #1E3A5F)' }}
      />
    </div>
  )
}
