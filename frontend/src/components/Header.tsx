import { useNavigate } from 'react-router-dom'
import { useProgress } from '../hooks/useProgress'

interface HeaderProps {
  /** Show a back arrow instead of the logo click */
  showBack?: boolean
}

export default function Header({ showBack = false }: HeaderProps) {
  const navigate = useNavigate()
  const { progress } = useProgress()

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 shadow-sm"
      style={{ background: '#FFF8F0', borderBottom: '2px solid #FFB800' }}
    >
      {/* Left: back or logo */}
      <button
        onClick={() => (showBack ? navigate(-1) : navigate('/'))}
        className="flex items-center gap-2 font-bold text-lg active:opacity-70 transition-opacity"
        style={{ color: '#1E3A5F' }}
      >
        {showBack ? (
          <span className="text-2xl">←</span>
        ) : (
          <>
            <span className="text-2xl">🇮🇳</span>
            <span>Indian Duolingo</span>
          </>
        )}
      </button>

      {/* Right: streak + XP */}
      <div className="flex items-center gap-3">
        {progress.currentStreak > 0 && (
          <span
            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold text-white"
            style={{ background: '#FF6B00' }}
          >
            🔥 {progress.currentStreak}
          </span>
        )}
        <span
          className="flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold"
          style={{ background: '#FFF3E0', color: '#C85C3A', border: '1px solid #FFB800' }}
        >
          ⭐ {progress.totalXP} XP
        </span>
      </div>
    </header>
  )
}
