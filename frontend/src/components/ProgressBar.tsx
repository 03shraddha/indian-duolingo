interface ProgressBarProps {
  current: number  // 0-based index of current exercise
  total: number
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="w-full flex items-center gap-3 px-4 py-2">
      <div
        className="flex-1 h-3 rounded-full overflow-hidden"
        style={{ background: '#FFE0B2' }}
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full progress-fill"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #FF6B00, #FFB800)',
          }}
        />
      </div>
      <span className="text-sm font-semibold" style={{ color: '#C85C3A', minWidth: '3rem', textAlign: 'right' }}>
        {current}/{total}
      </span>
    </div>
  )
}
