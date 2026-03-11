import { useCallback, useRef } from 'react'
import { startTTSStream, tts, type TTSOptions } from '../api/sarvam'

// ── Helpers ────────────────────────────────────────────────────────────────────

function playBlobUrl(
  url: string,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url)
    audioRef.current = audio
    audio.onended = () => { URL.revokeObjectURL(url); resolve() }
    audio.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Audio playback failed')) }
    audio.play().catch(reject)
  })
}

function playBase64(
  base64: string,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(`data:audio/wav;base64,${base64}`)
    audioRef.current = audio
    audio.onended = () => resolve()
    audio.onerror = () => reject(new Error('Audio playback failed'))
    audio.play().catch(reject)
  })
}

/**
 * Pipe a ReadableStream into MediaSource — audio plays as first chunk arrives.
 * onPlay fires the moment audio.play() is called (first chunk buffered).
 */
function playWithMediaSource(
  stream: ReadableStream<Uint8Array>,
  mimeType: string,
  audioRef: React.MutableRefObject<HTMLAudioElement | null>,
  onPlay?: () => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const mediaSource = new MediaSource()
    const objectUrl = URL.createObjectURL(mediaSource)
    const audio = new Audio()
    audioRef.current = audio
    audio.src = objectUrl

    audio.onended = () => { URL.revokeObjectURL(objectUrl); resolve() }
    audio.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Audio playback failed')) }

    mediaSource.addEventListener('sourceopen', async () => {
      let sourceBuffer: SourceBuffer
      try {
        sourceBuffer = mediaSource.addSourceBuffer(mimeType)
      } catch {
        URL.revokeObjectURL(objectUrl)
        reject(new Error(`MSE: unsupported MIME ${mimeType}`))
        return
      }

      const reader = stream.getReader()
      let playStarted = false

      const waitForUpdate = () =>
        new Promise<void>((res) => sourceBuffer.addEventListener('updateend', () => res(), { once: true }))

      const pump = async (): Promise<void> => {
        const { done, value } = await reader.read()

        if (done) {
          if (sourceBuffer.updating) await waitForUpdate()
          if (mediaSource.readyState === 'open') mediaSource.endOfStream()
          return
        }

        if (sourceBuffer.updating) await waitForUpdate()
        sourceBuffer.appendBuffer(new Uint8Array(value).buffer as ArrayBuffer)
        await waitForUpdate()

        if (!playStarted) {
          playStarted = true
          audio.play()
            .then(() => onPlay?.())
            .catch(reject)
        }

        return pump()
      }

      pump().catch(reject)
    }, { once: true })
  })
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  function stopCurrent() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }

  const play = useCallback((base64: string): Promise<void> => {
    stopCurrent()
    return new Promise((resolve, reject) => {
      const audio = new Audio(`data:audio/wav;base64,${base64}`)
      audioRef.current = audio
      audio.onended = () => resolve()
      audio.onerror = () => reject(new Error('Audio playback failed'))
      audio.play().catch(reject)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * Stream TTS — plays as first chunk arrives via MediaSource.
   * Falls back to full-blob playback if MSE fails, and falls back to
   * the non-streaming /tts endpoint if the stream endpoint itself fails.
   *
   * onPlay fires when audio.play() is called — use it to hide spinners.
   */
  const playStream = useCallback(async (opts: TTSOptions, onPlay?: () => void): Promise<void> => {
    stopCurrent()

    try {
      const { stream } = await startTTSStream(opts)
      const mimeType = 'audio/mpeg'

      if (typeof MediaSource !== 'undefined' && MediaSource.isTypeSupported(mimeType)) {
        try {
          return await playWithMediaSource(stream, mimeType, audioRef, onPlay)
        } catch {
          // MSE failed — fall through to blob
        }
      }

      // Blob fallback: collect stream → play
      const blob = await new Response(stream, { headers: { 'Content-Type': mimeType } }).blob()
      const url = URL.createObjectURL(blob)
      onPlay?.()
      return playBlobUrl(url, audioRef)

    } catch {
      // Streaming endpoint failed — fall back to non-streaming /tts
      const base64 = await tts(opts)
      onPlay?.()
      return playBase64(base64, audioRef)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stop = useCallback(() => { stopCurrent() }, [])

  return { play, playStream, stop }
}
