import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { useProgress } from '../hooks/useProgress'
import type { Language } from '../types'

interface HeaderProps {
  /** Show a back arrow instead of the logo */
  showBack?: boolean
  /** Override the default back navigation (e.g. to show a confirmation modal) */
  onBack?: () => void
}

export default function Header({ showBack = false, onBack }: HeaderProps) {
  const navigate = useNavigate()
  const { language } = useLanguage()
  const activeLang = (language ?? 'hindi') as Language
  const { progress } = useProgress(activeLang)

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 shadow-sm"
      style={{
        background: '#F8F5F0',
        // Subtle bottom border — not the heavy marigold #FFB800
        borderBottom: '1px solid #EDE8E0',
      }}
    >
      {/* Left: back arrow or logo */}
      <button
        onClick={() => {
          if (showBack) {
            onBack ? onBack() : navigate(-1)
          } else {
            navigate('/home')
          }
        }}
        className="flex items-center gap-2 font-bold text-lg active:opacity-70 transition-opacity"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1F3A5F' }}
      >
        {showBack ? (
          <span className="text-2xl" style={{ color: '#1F3A5F' }}>←</span>
        ) : (
          <>
            <span className="text-2xl">🇮🇳</span>
            {/* Hidden on very small screens to prevent header overflow */}
            <span className="brand-text" style={{ color: '#1F3A5F' }}>Indian Duolingo</span>
          </>
        )}
      </button>

      {/* Right: streak + XP */}
      <div className="flex items-center gap-2">
        {/* Streak — orange is appropriate here (key motivator) */}
        {progress.currentStreak > 0 && (
          <span
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold text-white"
            style={{ background: '#FF7A00' }}
          >
            🔥 {progress.currentStreak}
          </span>
        )}
        {/* XP — neutral, not orange */}
        <span
          className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold"
          style={{ background: '#F0EDE8', color: '#1F3A5F', border: '1px solid #EDE8E0' }}
        >
          ⭐ {progress.totalXP} XP
        </span>
      </div>
    </header>
  )
}
