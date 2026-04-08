# 🇮🇳 Indian Duolingo — Learn Indian Languages

> **Short, voice-first lessons. Conversational phrases. No textbook grammar.**

---

## What Is This?

Indian Duolingo is a free, browser-based language learning app designed for people who want to pick up everyday spoken Indian languages — quickly and practically.

Instead of memorising grammar rules and vocabulary lists, you learn the phrases people actually use: ordering chai, asking for directions, saying yes and no, making plans. You hear them, repeat them, and get instant feedback.

No account needed. Works in your browser. Takes 2–5 minutes per lesson.

---

## Languages Available

| Language | Script | Greeting |
|----------|--------|---------|
| **Hindi** | हिंदी | नमस्ते |
| **Kannada** | ಕನ್ನಡ | ನಮಸ್ಕಾರ |
| **Tamil** | தமிழ் | வணக்கம் |
| **Telugu** | తెలుగు | నమస్కారం |
| **Bengali** | বাংলা | নমস্কার |
| **Marathi** | मराठी | नमस्कार |

---

## How It Works

**1. Pick your language** — Choose from Hindi, Kannada, Tamil, Telugu, Bengali, or Marathi.

**2. Follow the lesson path** — Lessons are organized into units. Each lesson takes about 2 minutes and contains 5–6 exercises.

**3. Three exercise types:**

- **Listen & Identify** — Hear a phrase, pick the correct English meaning from four options.
- **Speak & Repeat** — See a phrase, press and hold the mic, speak it. Get instant pronunciation feedback.
- **Select the Phrase** — Read an English prompt, tap the matching native-script phrase from four options. Each option shows the script alongside its Roman transliteration for beginners unfamiliar with the script.

**4. Track your progress** — Earn XP, build a daily streak, and watch your completion ring grow on the home screen.

---

## Who Is This For?

- Students moving to a new state for college
- Professionals relocated for work
- Travelers wanting to connect with locals
- Diaspora learners who grew up speaking one language and want to pick up another
- Anyone curious about Indian languages beyond their mother tongue

---

## Design Philosophy

The interface is warm, minimal, and distinctly Indian — without being loud. A soft cream background gives breathing space. Orange is reserved for key actions only (the Continue button, active lessons, streak badges). Cultural identity comes from subtle mandala motifs at low opacity, not heavy decoration.

Script fonts are used for every language (Noto Sans Devanagari, Kannada, Tamil, Telugu, Bengali), so phrases render beautifully alongside their Roman transliterations.

Answer options in the Select the Phrase exercise display native script with the Roman transliteration directly below each choice (e.g. नमस्ते / *Namaste*), making the app accessible to users who cannot yet read the script.

---

---

# Technical Documentation

> For developers who want to run, extend, or contribute to this project.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + Vite + Tailwind CSS 4 |
| Backend | Python FastAPI + Sarvam AI SDK (`sarvamai`) |
| Storage | `localStorage` — no database, no auth |
| TTS | Sarvam `bulbul:v3` — all 6 languages |
| STT | Sarvam `saarika:v2.5` — speech-to-text for pronunciation scoring |
| Fonts | Nunito (UI), Noto Sans (Devanagari, Kannada, Tamil, Telugu, Bengali) |

## Running Locally

### 1. Backend (FastAPI)

```bash
cd backend

# Set up environment
cp .env.example .env
# Edit .env → set SARVAM_API_KEY=your_key_here

pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```

API available at http://localhost:8000

### 2. Frontend (React + Vite)

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Vite proxies `/api/*` → `localhost:8000` automatically.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/tts` | Text → speech (base64 WAV). Params: `text`, `language_code`, `speaker`, `pace` |
| POST | `/api/stt` | Audio blob → transcript. Params: `audio_file` (webm), `language_code` |
| POST | `/api/translate` | Translate text. Params: `text`, `source_language_code`, `target_language_code` |

### Supported Language Codes

| Language | Code | TTS Speaker |
|----------|------|-------------|
| Hindi | `hi-IN` | `priya` |
| Kannada | `kn-IN` | `priya` |
| Tamil | `ta-IN` | `ritu` |
| Telugu | `te-IN` | `neha` |
| Bengali | `bn-IN` | `kavitha` |
| Marathi | `mr-IN` | `priya` |

> **Note:** Uses `bulbul:v3`. Valid v3 speakers include: `priya`, `ritu`, `neha`, `kavitha`, `aditya`, `shubh`, `rahul`, `rohan`, `manisha`, `vidya`, `arya`, `karun`, `hitesh`, `pooja`, `simran`, `kavya`, `amit`, `dev`, `ishita`, `shreya`, `varun`, `manan`, `sumit`, `roopa`, `kabir`, `aayan`, `advait`, `tarun`, `sunny`, `mani`, `vijay`, `shruti`, `suhani`, `mohit`, `soham` and others. `anushka` and `abhilash` are **v2-only** and will fail with v3.

## Project Structure

```
india-duolingo/
├── frontend/
│   └── src/
│       ├── api/sarvam.ts          # TTS, STT, translate fetch wrappers
│       ├── components/
│       │   ├── exercises/
│       │   │   ├── ListenIdentify.tsx
│       │   │   ├── SelectPhrase.tsx
│       │   │   └── SpeakRepeat.tsx
│       │   ├── FeedbackOverlay.tsx
│       │   ├── Header.tsx
│       │   └── ProgressBar.tsx
│       ├── data/
│       │   ├── lessons.ts          # Language index + getLessonById()
│       │   ├── lessons-hindi.ts    # 9 lessons, 3 units
│       │   ├── lessons-kannada.ts  # 3 lessons, 1 unit
│       │   ├── lessons-tamil.ts    # 3 lessons, 1 unit
│       │   ├── lessons-telugu.ts   # 3 lessons, 1 unit
│       │   ├── lessons-bengali.ts  # 3 lessons, 1 unit
│       │   └── lessons-marathi.ts  # 3 lessons, 1 unit
│       ├── hooks/
│       │   ├── useLanguage.ts      # Selected language (localStorage)
│       │   ├── useProgress.ts      # Per-language progress (localStorage)
│       │   └── useAudio.ts         # base64 audio playback
│       ├── pages/
│       │   ├── LanguageSelect.tsx  # / — pick a language
│       │   ├── Home.tsx            # /home — dashboard
│       │   ├── LessonPath.tsx      # /learn — lesson list
│       │   └── Exercise.tsx        # /exercise/:lessonId
│       └── types/index.ts          # Language, LanguageConfig, Exercise types
│
└── backend/
    ├── main.py                     # FastAPI app + CORS
    └── routes/
        ├── tts.py
        ├── stt.py
        └── translate.py
```

## Adding a New Language

1. Add a `Language` union variant in `frontend/src/types/index.ts`
2. Add a `LanguageConfig` entry in `LANGUAGE_CONFIG` (same file)
3. Create `frontend/src/data/lessons-<lang>.ts` with `Unit[]` content
4. Import and add to `lessonsByLanguage` in `frontend/src/data/lessons.ts`
5. Add the Google Font for the script in `frontend/index.html`
6. Add the CSS class in `frontend/src/index.css`

## Exercise Data Shape

```typescript
interface Exercise {
  id: string
  type: 'listen-identify' | 'speak-repeat' | 'select-phrase'
  englishText: string          // "Hello"
  targetText: string           // "నమస్కారం" — phrase in target script
  romanized: string            // "Namaskaram" — pronunciation hint
  options?: string[]           // listen-identify: 4 English choices
                               // select-phrase: 4 native-script choices
  optionsRomanized?: string[]  // select-phrase: Roman transliteration for
                               // each option (parallel to options[])
}
```

## Pronunciation Scoring (SpeakRepeat)

Uses bigram similarity between STT transcript and expected `targetText`:
- `≥ 0.85` → Excellent
- `≥ 0.65` → Good try
- `≥ 0.50` → Almost there (passes)
- `< 0.50` → Keep practising (fails)

## Progress Storage

Progress is stored per language in localStorage:
- Key: `idl-progress-{language}` (e.g. `idl-progress-hindi`)
- Selected language: `idl-language`
- Structure: `{ completedLessons: string[], currentStreak: number, lastPlayedDate: string, totalXP: number }`

## Notes

- TTS uses `bulbul:v3` — supports all 6 languages
- All 6 languages follow the same exercise pattern per lesson: **Listen & Identify → Speak & Repeat → Select the Phrase → Speak & Repeat → Listen & Identify**
- `select-phrase` options always include `optionsRomanized` so beginners can read choices without knowing the script
- While loading TTS audio, a spinning ring + "Preparing audio…" label replaces the mic controls, and the word card border pulses orange — dismisses automatically when audio is ready
- Press-and-hold mic recording works on both desktop (mousedown/mouseup) and mobile (touchstart/touchend)
- All lessons are unlocked — no progression gates

---

## Interview Reference

### Overview

Indian Duolingo teaches everyday spoken phrases across six Indian languages — no grammar rules, no account needed, 2–5 minutes per lesson.

**What it does:**
- User picks a language → works through 5–6 exercises → earns XP and builds a streak
- Three exercise types: Listen & Identify, Speak & Repeat, Select the Phrase
- Backend calls Sarvam AI on demand for audio generation and pronunciation scoring
- All progress lives in the browser's `localStorage` — no database, no backend state

**AI models powering it:**

| Model | Role | Where it's used |
|-------|------|----------------|
| `bulbul:v3` | Text-to-speech | Generates audio for every phrase in every language |
| `saarika:v2.5` | Speech-to-text | Transcribes the user's mic recording in Speak & Repeat |

Pronunciation is then scored by comparing the STT transcript to the expected phrase using **bigram similarity** — a lightweight string-matching heuristic that doesn't require a separate ML model.

---

### Narrative

**How it started — Hindi only**
- Began as **BhaashaPath**, a Hindi vocabulary app
- First pivot: stop teaching word lists and grammar; teach phrases people actually say (ordering chai, asking directions, agreeing/disagreeing)
- That reframe came before any exercise was built and shaped every content decision after

**Expanding to six languages**
- Adding a second language immediately revealed a structural problem: any language-specific value hardcoded in exercise logic became a bug
- Forced a clean split — language config (speaker names, font classes, lesson file paths) is separate from exercise rendering logic
- Adding a language now requires touching **six separate locations**: TypeScript union type, language config map, lesson data file, lessons index, Google Font import, CSS script class — all six must be updated together or the language appears in the selector but breaks mid-exercise

**Why type-translation was removed**
- Early design had users type the Hindi equivalent of an English phrase
- Problem: typing in a non-Latin script on a mobile keyboard requires already knowing that script — it excluded every beginner
- Replaced with **Select the Phrase (MCQ)**: four options shown in native script with Roman transliteration directly below each one — readable without any prior script knowledge

**Solving TTS latency**
- Original flow: call Sarvam API → wait for full base64 WAV to download → play
- When perceived load time was too long, switched to **`MediaSource` streaming**:
  - Backend streams audio in chunks over HTTP
  - First chunk plays immediately while the rest buffers in the background
  - Cuts perceived wait time from "wait for the whole file" to "starts almost instantly"

**The iOS audio bug**
- WebKit (Safari/iOS) requires a user gesture before any audio context can be created — Chrome does not
- The streaming approach initialized the audio context before any gesture had occurred, causing a silent failure that only showed up on iOS
- Fix: detect platform at startup, defer audio context creation to the first explicit tap
- Required making every exercise component gesture-aware

**TTS model upgrade: v2 → v3**
- `bulbul:v2` speaker names (e.g., `anushka`, `abhilash`) are invalid on `v3`
- `v3` doesn't return a descriptive error — it just fails silently at runtime
- Only discovered in production; fixed by pinning an explicit valid speaker list per language in config

**Testing came last**
- Vitest tests were added one commit before the Render deployment was configured
- The tests cover XP accounting and progress state — the exact two areas where bugs appeared just before launch
- Classic build-first, harden-before-deploy trajectory under time pressure

---

### Technical Reflection

**Constraints**

| Constraint | What it means in practice |
|-----------|--------------------------|
| `bulbul:v3` speaker names are a fixed closed list | Using any v2 speaker name fails silently at runtime — not caught until production |
| iOS WebKit audio context rules differ from Chrome | Entire class of bugs that don't reproduce during development |
| `MediaSource` unsupported in older Safari | Two audio delivery paths (streaming + full WAV fallback) must both be maintained |
| Default single uvicorn worker | TTS requests queue under concurrent load — latency scales linearly with users |
| `localStorage`-only persistence | No multi-device sync; clearing browser data wipes all progress with no recovery |

**How key problems were resolved**

| Problem | Solution |
|---------|---------|
| High TTS perceived latency | Stream via `MediaSource` — first chunk plays immediately |
| iOS audio context crash | Gate initialization behind user gesture; detect platform at app start |
| Streaming path failure risk | Keep `/tts` (full WAV) endpoint as fallback alongside the streaming path |
| Pronunciation scoring without an ML model | Bigram similarity between STT output and expected text; pass/fail thresholds at 0.85 / 0.65 / 0.50 |
| v2 speaker names breaking v3 TTS | Hardcode the valid v3 speaker list per language in config; never derive from user input |

**What breaks at scale**
- **Concurrency**: One uvicorn worker handles all TTS calls sequentially — 10 concurrent users means the 10th user waits for all 9 ahead of them
- **Storage**: `localStorage` has per-domain size limits; users studying multiple languages simultaneously will accumulate state faster
- **Pronunciation scoring**: Bigram similarity handles short phrases well but produces inconsistent results on longer sentences where multiple valid word orders exist
- **Language additions**: The six-file update requirement has no enforcement mechanism — a partial add leaves the language visibly broken in the UI

**Maintenance risks**
- Sarvam may rename or deprecate speakers in `bulbul:v3`; the speaker mapping lives in app code, so any change requires a redeploy
- As Hindi expands past 9 lessons, the flat one-file-per-language structure will need an index layer or splitting by unit
- The dual audio path (streaming + WAV fallback) doubles the surface area for future audio bugs
