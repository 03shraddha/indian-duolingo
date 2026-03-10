import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { LANGUAGE_CONFIG } from '../types'
import type { Language } from '../types'

/** Faint mandala-inspired background — 5% opacity only */
function MandalaBg() {
  return (
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
        <circle cx="200" cy="200" r="8"  fill="#1F3A5F" opacity="0.4" />
      </svg>
    </div>
  )
}

const LANGUAGES: Language[] = ['hindi', 'kannada', 'tamil', 'telugu', 'bengali', 'marathi']

export default function LanguageSelect() {
  const navigate = useNavigate()
  const { setLanguage } = useLanguage()

  function handleSelect(lang: Language) {
    setLanguage(lang)
    navigate('/home')
  }

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: '#F8F5F0' }}>
      <MandalaBg />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative z-10">
        <div className="w-full max-w-sm sm:max-w-[420px]">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🇮🇳</div>
            <h1 className="font-extrabold mb-2 text-2xl sm:text-[28px]" style={{ color: '#1F2937', letterSpacing: '-0.3px' }}>
              Choose your language
            </h1>
            {/* Sub-heading in Devanagari */}
            <p className="devanagari font-semibold" style={{ fontSize: 16, color: '#9CA3AF' }}>
              भाषा चुनें
            </p>
          </div>

          {/* Language cards — 2×2 grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-8">
            {LANGUAGES.map((lang) => {
              const cfg = LANGUAGE_CONFIG[lang]
              return (
                <button
                  key={lang}
                  onClick={() => handleSelect(lang)}
                  className="flex flex-col items-center text-center rounded-2xl transition-all active:scale-95"
                  style={{
                    background: '#FFFFFF',
                    border: '1.5px solid #EDE8E0',
                    borderRadius: 18,
                    padding: '16px 12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                    cursor: 'pointer',
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.transform = 'translateY(-3px)'
                    el.style.boxShadow = '0 10px 28px rgba(0,0,0,0.10)'
                    el.style.borderColor = '#FFC857'
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.transform = 'translateY(0)'
                    el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)'
                    el.style.borderColor = '#EDE8E0'
                  }}
                >
                  {/* Emoji */}
                  <span style={{ fontSize: 30, marginBottom: 8 }}>{cfg.emoji}</span>

                  {/* Language name in English */}
                  <p className="font-bold mb-1 text-sm sm:text-base" style={{ color: '#1F2937' }}>
                    {cfg.name}
                  </p>

                  {/* Native script name */}
                  <p className={`font-semibold mb-1.5 ${cfg.scriptClass}`}
                    style={{ fontSize: 16, color: '#1F3A5F' }}>
                    {cfg.nativeName}
                  </p>

                  {/* Greeting phrase */}
                  <p className={`font-medium ${cfg.scriptClass}`}
                    style={{ fontSize: 12, color: '#9CA3AF' }}>
                    {cfg.greeting}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Footer note */}
          <p className="text-center text-sm" style={{ color: '#9CA3AF' }}>
            You can change this anytime from the home screen
          </p>

        </div>
      </div>
    </div>
  )
}
