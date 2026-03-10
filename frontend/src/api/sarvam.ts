/** Fetch wrappers for the FastAPI backend (which calls Sarvam AI APIs). */

// In production, set VITE_API_URL to your deployed backend URL (e.g. https://your-app.railway.app)
// In development, falls back to '/api' which Vite proxies to localhost:8000
const BASE = (import.meta.env.VITE_API_URL ?? '/api') + ''

/** Returns an AbortSignal that fires after `ms` milliseconds. */
function timeoutSignal(ms: number): AbortSignal {
  const ctrl = new AbortController()
  setTimeout(() => ctrl.abort(), ms)
  return ctrl.signal
}

// ── Text-to-Speech ────────────────────────────────────────────────────────────

export interface TTSOptions {
  text: string
  language_code?: string
  speaker?: string
  pace?: number
}

// In-memory TTS cache — keyed by all request params.
// Caches the Promise itself so concurrent calls for the same audio share one request.
const ttsCache = new Map<string, Promise<string>>()

function ttsCacheKey(opts: TTSOptions): string {
  return `${opts.text}:${opts.language_code ?? 'hi-IN'}:${opts.speaker ?? 'anushka'}:${opts.pace ?? 1.0}`
}

/**
 * Convert text to speech.
 * Returns a base64-encoded audio string (WAV, bulbul:v3).
 * Results are cached in memory — replay and next-exercise preloads are instant.
 */
export async function tts(opts: TTSOptions): Promise<string> {
  const key = ttsCacheKey(opts)
  if (ttsCache.has(key)) return ttsCache.get(key)!

  const promise = fetch(`${BASE}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: opts.text,
      language_code: opts.language_code ?? 'hi-IN',
      speaker: opts.speaker ?? 'anushka',
      pace: opts.pace ?? 1.0,
    }),
    signal: timeoutSignal(35_000), // 35s — slightly over backend's 30s
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail ?? `TTS failed (${res.status})`)
      }
      const data = await res.json()
      return data.audio_base64 as string
    })
    .catch((err) => {
      // Remove failed entries so retries can succeed
      ttsCache.delete(key)
      throw err
    })

  ttsCache.set(key, promise)
  return promise
}

/**
 * Fire-and-forget TTS preload — warms the cache for the next exercise.
 * Errors are silently ignored since this is a best-effort optimisation.
 */
export function preloadTTS(opts: TTSOptions): void {
  const key = ttsCacheKey(opts)
  if (ttsCache.has(key)) return // already cached
  tts(opts).catch(() => {})
}

// ── Speech-to-Text ────────────────────────────────────────────────────────────

/**
 * Transcribe an audio Blob (webm/wav) to text.
 * Returns the transcript string.
 */
export async function stt(audioBlob: Blob, languageCode = 'hi-IN', ext = 'webm'): Promise<string> {
  const form = new FormData()
  // Use the correct extension so the backend/SDK can infer the audio codec.
  form.append('audio_file', audioBlob, `recording.${ext}`)
  form.append('language_code', languageCode)

  const res = await fetch(`${BASE}/stt`, { method: 'POST', body: form, signal: timeoutSignal(35_000) })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? `STT failed (${res.status})`)
  }
  const data = await res.json()
  return data.transcript as string
}

// ── Translation ───────────────────────────────────────────────────────────────

/**
 * Translate text between languages.
 * Returns the translated string.
 */
export async function translate(
  text: string,
  sourceLang = 'en-IN',
  targetLang = 'hi-IN',
): Promise<string> {
  const res = await fetch(`${BASE}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      source_language_code: sourceLang,
      target_language_code: targetLang,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? `Translate failed (${res.status})`)
  }
  const data = await res.json()
  return data.translated_text as string
}
