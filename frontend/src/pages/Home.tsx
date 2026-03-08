import { useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'

/** Full detailed Indian mandala SVG */
function Mandala({ opacity = 1 }: { opacity?: number }) {
  const petals8 = [0, 45, 90, 135, 180, 225, 270, 315]
  const petals16 = Array.from({ length: 16 }, (_, i) => i * 22.5)

  return (
    <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ opacity }}>
      {/* Outer dotted ring */}
      <circle cx="200" cy="200" r="190" stroke="#FF7A00" strokeWidth="1" strokeDasharray="3 6" />
      {/* Outer 16 diamond tips */}
      {petals16.map((deg) => (
        <ellipse key={`od${deg}`} cx="200" cy="30" rx="4" ry="10"
          fill="#FFC857" fillOpacity="0.6" transform={`rotate(${deg} 200 200)`} />
      ))}
      {/* Second ring */}
      <circle cx="200" cy="200" r="162" stroke="#FFC857" strokeWidth="1.5" strokeDasharray="5 5" />
      {/* Large outer petals */}
      {petals8.map((deg) => (
        <ellipse key={`lp${deg}`} cx="200" cy="62" rx="12" ry="28"
          fill="#FF7A00" fillOpacity="0.18" stroke="#FF7A00" strokeWidth="1"
          transform={`rotate(${deg} 200 200)`} />
      ))}
      {/* Ring 3 */}
      <circle cx="200" cy="200" r="130" stroke="#E07A5F" strokeWidth="1" strokeDasharray="4 4" />
      {/* Mid petals */}
      {petals8.map((deg) => (
        <ellipse key={`mp${deg}`} cx="200" cy="90" rx="8" ry="20"
          fill="#E07A5F" fillOpacity="0.25" stroke="#E07A5F" strokeWidth="0.8"
          transform={`rotate(${deg} 200 200)`} />
      ))}
      {/* 16 small inner petals */}
      {petals16.map((deg) => (
        <ellipse key={`sp${deg}`} cx="200" cy="118" rx="5" ry="12"
          fill="#FFC857" fillOpacity="0.4" transform={`rotate(${deg} 200 200)`} />
      ))}
      {/* Ring 4 */}
      <circle cx="200" cy="200" r="100" stroke="#FF7A00" strokeWidth="1.5" />
      {/* Inner diamond star */}
      {petals8.map((deg) => (
        <ellipse key={`is${deg}`} cx="200" cy="130" rx="6" ry="18"
          fill="#1F3A5F" fillOpacity="0.15" transform={`rotate(${deg} 200 200)`} />
      ))}
      {/* Ring 5 */}
      <circle cx="200" cy="200" r="72" stroke="#FFC857" strokeWidth="1.5" strokeDasharray="3 3" />
      {/* Inner flower petals */}
      {petals8.map((deg) => (
        <ellipse key={`fp${deg}`} cx="200" cy="152" rx="10" ry="20"
          fill="#FF7A00" fillOpacity="0.3" stroke="#FF7A00" strokeWidth="0.5"
          transform={`rotate(${deg} 200 200)`} />
      ))}
      {/* Ring 6 */}
      <circle cx="200" cy="200" r="50" stroke="#E07A5F" strokeWidth="1.5" />
      {/* Core lotus */}
      {petals8.map((deg) => (
        <ellipse key={`cl${deg}`} cx="200" cy="168" rx="7" ry="14"
          fill="#E07A5F" fillOpacity="0.5" transform={`rotate(${deg} 200 200)`} />
      ))}
      {/* Center circles */}
      <circle cx="200" cy="200" r="26" fill="#FFC857" fillOpacity="0.3" stroke="#FF7A00" strokeWidth="2" />
      <circle cx="200" cy="200" r="14" fill="#FF7A00" fillOpacity="0.5" />
      <circle cx="200" cy="200" r="6" fill="#FF7A00" />
    </svg>
  )
}

/** Repeating Indian geometric border (diamonds + dots) */
function BorderPattern({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 800 24" preserveAspectRatio="none"
      style={{ display: 'block', transform: flip ? 'scaleY(-1)' : undefined }}>
      <rect width="800" height="24" fill="#FF7A00" />
      {Array.from({ length: 40 }, (_, i) => (
        <g key={i} transform={`translate(${i * 20}, 0)`}>
          <polygon points="10,2 18,12 10,22 2,12" fill="#FFC857" opacity="0.85" />
          <circle cx="10" cy="12" r="2" fill="#1F3A5F" opacity="0.5" />
        </g>
      ))}
    </svg>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const { progress } = useProgress()

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#F8F5F0' }}>

      {/* Top Indian border */}
      <div style={{ height: 24, flexShrink: 0 }}><BorderPattern /></div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 relative">

        {/* Large faded background mandala */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div style={{ width: 500, height: 500, maxWidth: '90vw', maxHeight: '90vw' }}>
            <Mandala opacity={0.07} />
          </div>
        </div>

        {/* Corner accent mandalas */}
        <div className="absolute top-0 left-0 pointer-events-none select-none"
          style={{ width: 160, height: 160, transform: 'translate(-35%, -35%)' }}>
          <Mandala opacity={0.13} />
        </div>
        <div className="absolute bottom-0 right-0 pointer-events-none select-none"
          style={{ width: 160, height: 160, transform: 'translate(35%, 35%)' }}>
          <Mandala opacity={0.13} />
        </div>

        {/* Content card */}
        <div className="z-10 text-center w-full" style={{ maxWidth: 360 }}>

          {/* Mandala logo */}
          <div className="flex justify-center mb-5">
            <div style={{ width: 80, height: 80 }}><Mandala opacity={1} /></div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-extrabold mb-1" style={{ color: '#1F3A5F', letterSpacing: '-0.5px' }}>
            Indian Duolingo
          </h1>
          <p className="devanagari text-xl font-semibold mb-5" style={{ color: '#FF7A00' }}>
            इंडियन ड्यूओलिंगो
          </p>

          {/* Ornamental divider */}
          <div className="flex items-center gap-3 justify-center mb-5">
            <div style={{ flex: 1, height: 1, background: '#E07A5F', opacity: 0.3 }} />
            <span style={{ color: '#E07A5F', fontSize: 12 }}>◆</span>
            <div style={{ flex: 1, height: 1, background: '#E07A5F', opacity: 0.3 }} />
          </div>

          <p className="text-base mb-8" style={{ color: '#6b5744', lineHeight: 1.6 }}>
            Learn Hindi the way<br />Indians actually speak it.
          </p>

          {/* Streak pill — only after first lesson */}
          {progress.currentStreak > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-sm font-semibold"
              style={{ background: '#FFF3E0', color: '#FF7A00', border: '1px solid #FFC857' }}>
              🔥 {progress.currentStreak}-day streak · {progress.totalXP} XP
            </div>
          )}

          {/* CTA */}
          <button
            onClick={() => navigate('/learn')}
            className="w-full py-4 rounded-2xl text-lg font-bold text-white active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #FF7A00 0%, #FFC857 100%)', boxShadow: '0 6px 20px rgba(255,122,0,0.35)' }}
          >
            {progress.completedLessons.length > 0 ? 'Continue Learning →' : 'Start Learning →'}
          </button>

          <p className="mt-4 text-xs" style={{ color: '#a08878' }}>
            No account needed · Progress saved in your browser
          </p>
        </div>
      </div>

      {/* Bottom Indian border */}
      <div style={{ height: 24, flexShrink: 0 }}><BorderPattern flip /></div>
    </div>
  )
}
