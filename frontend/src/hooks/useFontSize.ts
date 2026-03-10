import { useState, useEffect } from 'react'

type FontSize = 'normal' | 'large'

const KEY = 'idl-font-size'

export function useFontSize() {
  const [fontSize, setFontSize] = useState<FontSize>(
    () => (localStorage.getItem(KEY) as FontSize | null) ?? 'normal'
  )

  // Keep <html data-fontsize="…"> in sync so CSS overrides can target it
  useEffect(() => {
    document.documentElement.setAttribute('data-fontsize', fontSize)
    localStorage.setItem(KEY, fontSize)
  }, [fontSize])

  function toggleFontSize() {
    setFontSize((prev) => (prev === 'normal' ? 'large' : 'normal'))
  }

  return { fontSize, toggleFontSize }
}
