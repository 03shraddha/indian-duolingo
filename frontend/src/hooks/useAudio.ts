import { useCallback, useRef } from 'react'

/**
 * Play a base64-encoded audio string in the browser.
 * Returns a `play` function that accepts a base64 string and resolves when playback ends.
 */
export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const play = useCallback((base64: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }

      const audio = new Audio(`data:audio/wav;base64,${base64}`)
      audioRef.current = audio
      audio.onended = () => resolve()
      audio.onerror = () => reject(new Error('Audio playback failed'))
      audio.play().catch(reject)
    })
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }, [])

  return { play, stop }
}
