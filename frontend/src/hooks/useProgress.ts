import { useCallback, useState } from 'react'
import type { Progress } from '../types'

const STORAGE_KEY = 'idl-progress'
const XP_PER_LESSON = 10

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Progress
  } catch { /* ignore */ }
  return { completedLessons: [], currentStreak: 0, lastPlayedDate: '', totalXP: 0 }
}

function saveProgress(p: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}

/** React hook for reading and writing progress to localStorage. */
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress)

  /** Mark a lesson as complete, award XP, update streak. */
  const completeLesson = useCallback((lessonId: string) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev // already done

      const todayStr = today()
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      // Streak logic: increment if last played yesterday or today, reset otherwise
      let newStreak = prev.currentStreak
      if (prev.lastPlayedDate === todayStr) {
        newStreak = prev.currentStreak // already played today, no change
      } else if (prev.lastPlayedDate === yesterdayStr) {
        newStreak = prev.currentStreak + 1 // consecutive day
      } else {
        newStreak = 1 // streak broken, restart
      }

      const next: Progress = {
        completedLessons: [...prev.completedLessons, lessonId],
        currentStreak: newStreak,
        lastPlayedDate: todayStr,
        totalXP: prev.totalXP + XP_PER_LESSON,
      }
      saveProgress(next)
      return next
    })
  }, [])

  const isCompleted = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons],
  )

  return { progress, completeLesson, isCompleted }
}
