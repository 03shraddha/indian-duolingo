import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useProgress } from './useProgress'

// ── localStorage helpers ───────────────────────────────────────────────────

function getStoredProgress(language: string) {
  const raw = localStorage.getItem(`idl-progress-${language}`)
  return raw ? JSON.parse(raw) : null
}

// ── Tests ──────────────────────────────────────────────────────────────────

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts with zero XP and no completed lessons for a new user', () => {
    const { result } = renderHook(() => useProgress('hindi'))
    expect(result.current.progress.totalXP).toBe(0)
    expect(result.current.progress.completedLessons).toHaveLength(0)
    expect(result.current.progress.currentStreak).toBe(0)
  })

  it('completeLesson saves +10 XP to localStorage', () => {
    const { result } = renderHook(() => useProgress('hindi'))

    act(() => {
      result.current.completeLesson('lesson-1')
    })

    // React state should update
    expect(result.current.progress.totalXP).toBe(10)
    expect(result.current.progress.completedLessons).toContain('lesson-1')

    // localStorage should also be updated (this is the persistence check)
    const stored = getStoredProgress('hindi')
    expect(stored).not.toBeNull()
    expect(stored.totalXP).toBe(10)
    expect(stored.completedLessons).toContain('lesson-1')
  })

  it('completing multiple lessons accumulates XP', () => {
    const { result } = renderHook(() => useProgress('hindi'))

    act(() => { result.current.completeLesson('lesson-1') })
    act(() => { result.current.completeLesson('lesson-2') })
    act(() => { result.current.completeLesson('lesson-3') })

    expect(result.current.progress.totalXP).toBe(30)
    expect(result.current.progress.completedLessons).toHaveLength(3)

    const stored = getStoredProgress('hindi')
    expect(stored.totalXP).toBe(30)
  })

  it('completing the same lesson twice does not double XP', () => {
    const { result } = renderHook(() => useProgress('hindi'))

    act(() => { result.current.completeLesson('lesson-1') })
    act(() => { result.current.completeLesson('lesson-1') }) // duplicate

    expect(result.current.progress.totalXP).toBe(10)
    expect(result.current.progress.completedLessons).toHaveLength(1)

    const stored = getStoredProgress('hindi')
    expect(stored.totalXP).toBe(10)
  })

  it('isCompleted returns true only for completed lessons', () => {
    const { result } = renderHook(() => useProgress('hindi'))

    act(() => { result.current.completeLesson('lesson-1') })

    expect(result.current.isCompleted('lesson-1')).toBe(true)
    expect(result.current.isCompleted('lesson-2')).toBe(false)
  })

  it('a fresh hook instance reads persisted progress from localStorage', () => {
    // Simulate "complete lesson in Exercise page, then navigate to Home"
    const { result: exerciseHook } = renderHook(() => useProgress('hindi'))
    act(() => { exerciseHook.current.completeLesson('lesson-1') })

    // Unmount and remount (simulates navigating to another page)
    const { result: homeHook } = renderHook(() => useProgress('hindi'))

    expect(homeHook.current.progress.totalXP).toBe(10)
    expect(homeHook.current.isCompleted('lesson-1')).toBe(true)
  })

  it('progress is stored per-language and does not bleed across languages', () => {
    const { result: hindiHook } = renderHook(() => useProgress('hindi'))
    act(() => { hindiHook.current.completeLesson('lesson-1') })

    const { result: kannadaHook } = renderHook(() => useProgress('kannada'))

    expect(kannadaHook.current.progress.totalXP).toBe(0)
    expect(kannadaHook.current.isCompleted('lesson-1')).toBe(false)

    const hindiStored = getStoredProgress('hindi')
    const kannadaStored = getStoredProgress('kannada')
    expect(hindiStored.totalXP).toBe(10)
    expect(kannadaStored).toBeNull() // Kannada never written
  })

  it('first ever completion starts streak at 1', () => {
    const { result } = renderHook(() => useProgress('hindi'))
    act(() => { result.current.completeLesson('lesson-1') })

    expect(result.current.progress.currentStreak).toBe(1)
    const stored = getStoredProgress('hindi')
    expect(stored.currentStreak).toBe(1)
  })

  it('two completions on same day keeps streak at 1 (not 2)', () => {
    const { result } = renderHook(() => useProgress('hindi'))
    act(() => { result.current.completeLesson('lesson-1') })
    act(() => { result.current.completeLesson('lesson-2') })

    // Same day — streak should stay at 1, not increment to 2
    expect(result.current.progress.currentStreak).toBe(1)
  })

  it('streak increments to 2 when playing on consecutive days', () => {
    // Seed yesterday's progress manually
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]

    localStorage.setItem('idl-progress-hindi', JSON.stringify({
      completedLessons: ['lesson-0'],
      currentStreak: 1,
      lastPlayedDate: yesterdayStr,
      totalXP: 10,
    }))

    const { result } = renderHook(() => useProgress('hindi'))
    act(() => { result.current.completeLesson('lesson-1') })

    expect(result.current.progress.currentStreak).toBe(2)
    const stored = getStoredProgress('hindi')
    expect(stored.currentStreak).toBe(2)
  })

  it('streak resets to 1 when a day is missed', () => {
    // Seed progress from 3 days ago (streak broken)
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const pastStr = threeDaysAgo.toISOString().split('T')[0]

    localStorage.setItem('idl-progress-hindi', JSON.stringify({
      completedLessons: ['lesson-0'],
      currentStreak: 5,
      lastPlayedDate: pastStr,
      totalXP: 10,
    }))

    const { result } = renderHook(() => useProgress('hindi'))
    act(() => { result.current.completeLesson('lesson-1') })

    expect(result.current.progress.currentStreak).toBe(1)
    const stored = getStoredProgress('hindi')
    expect(stored.currentStreak).toBe(1)
  })
})
