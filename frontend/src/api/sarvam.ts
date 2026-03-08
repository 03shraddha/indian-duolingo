/** Fetch wrappers for the FastAPI backend (which calls Sarvam AI APIs). */

const BASE = '/api'

// ── Text-to-Speech ────────────────────────────────────────────────────────────

export interface TTSOptions {
  text: string
  language_code?: string
  speaker?: string
  pace?: number
}

/**
 * Convert text to speech.
 * Returns a base64-encoded audio string (WAV, bulbul:v3).
 */
export async function tts(opts: TTSOptions): Promise<string> {
  const res = await fetch(`${BASE}/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: opts.text,
      language_code: opts.language_code ?? 'hi-IN',
      speaker: opts.speaker ?? 'anushka',
      pace: opts.pace ?? 1.0,
    }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail ?? `TTS failed (${res.status})`)
  }
  const data = await res.json()
  return data.audio_base64 as string
}

// ── Speech-to-Text ────────────────────────────────────────────────────────────

/**
 * Transcribe an audio Blob (webm/wav) to text.
 * Returns the transcript string.
 */
export async function stt(audioBlob: Blob, languageCode = 'hi-IN'): Promise<string> {
  const form = new FormData()
  form.append('audio_file', audioBlob, 'recording.webm')
  form.append('language_code', languageCode)

  const res = await fetch(`${BASE}/stt`, { method: 'POST', body: form })
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
