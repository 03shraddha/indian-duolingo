import { useState } from 'react'
import type { Language } from '../types'

const STORAGE_KEY = 'idl-language'

/**
 * Hook for managing the user's selected language.
 * Persists to localStorage. Returns null if no language has been chosen yet.
 */
export function useLanguage() {
  const [language, setLanguageState] = useState<Language | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'hindi' || stored === 'kannada' || stored === 'tamil' || stored === 'telugu' || stored === 'bengali' || stored === 'marathi') {
      return stored as Language
    }
    return null
  })

  function setLanguage(lang: Language) {
    localStorage.setItem(STORAGE_KEY, lang)
    setLanguageState(lang)
  }

  function clearLanguage() {
    localStorage.removeItem(STORAGE_KEY)
    setLanguageState(null)
  }

  return { language, setLanguage, clearLanguage }
}
