import { useCallback, useState } from 'react'
import type { Language, Progress } from '../types'

const XP_PER_LESSON = 10

function storageKey(language: Language): string {
  return `idl-progress-${language}`
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

function loadProgress(language: Language): Progress {
  try {
    const raw = localStorage.getItem(storageKey(language))
    if (raw) return JSON.parse(raw) as Progress
  } catch { /* ignore */ }
  return { completedLessons: [], currentStreak: 0, lastPlayedDate: '', totalXP: 0 }
}

function saveProgress(language: Language, p: Progress) {
  localStorage.setItem(storageKey(language), JSON.stringify(p))
}

/** React hook for reading and writing per-language progress to localStorage. */
export function useProgress(language: Language) {
  const [progress, setProgress] = useState<Progress>(() => loadProgress(language))

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
      saveProgress(language, next)
      return next
    })
  }, [language])

  const isCompleted = useCallback(
    (lessonId: string) => progress.completedLessons.includes(lessonId),
    [progress.completedLessons],
  )

  return { progress, completeLesson, isCompleted }
}
