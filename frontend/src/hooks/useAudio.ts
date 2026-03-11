import { useCallback, useRef } from 'react'
import { startTTSStream, type TTSOptions } from '../api/sarvam'

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Play a blob/object URL, resolving when playback ends. Revokes the URL after playback. */
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

/**
 * Pipe a ReadableStream<Uint8Array> into a MediaSource and play via an <audio> element.
 * Calls onPlay the moment audio.play() fires — i.e. when the first chunk is buffered.
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
        // Slice to a plain ArrayBuffer to satisfy stricter TS lib typings
        const buf = value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength)
        sourceBuffer.appendBuffer(buf)
        await waitForUpdate()

        // Start playback after the first chunk is buffered
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

  /** Play a base64-encoded WAV string (legacy path). */
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
   * Stream TTS audio — playback starts as soon as the first MP3 chunk arrives.
   *
   * Uses MediaSource Extensions (MSE) when supported (Chrome, Firefox, Edge, Safari 15+).
   * Falls back to downloading the full blob then playing — still faster than base64.
   *
   * @param onPlay  Called the moment audio.play() fires (first chunk buffered).
   *                Use this to hide spinners, reveal script text, etc.
   */
  const playStream = useCallback(async (opts: TTSOptions, onPlay?: () => void): Promise<void> => {
    stopCurrent()

    const { stream } = await startTTSStream(opts)
    const mimeType = 'audio/mpeg'

    if (typeof MediaSource !== 'undefined' && MediaSource.isTypeSupported(mimeType)) {
      try {
        return await playWithMediaSource(stream, mimeType, audioRef, onPlay)
      } catch {
        // MSE failed — fall through to blob fallback
      }
    }

    // Fallback: collect full stream → blob URL → play
    const blob = await new Response(stream, { headers: { 'Content-Type': mimeType } }).blob()
    const url = URL.createObjectURL(blob)
    onPlay?.()
    return playBlobUrl(url, audioRef)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stop = useCallback(() => { stopCurrent() }, [])

  return { play, playStream, stop }
}
