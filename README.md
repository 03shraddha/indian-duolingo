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

Indian Duolingo is a browser-based language learning app covering six Indian languages — Hindi, Kannada, Tamil, Telugu, Bengali, and Marathi. The premise is conversational fluency in 2–5 minutes per lesson: users hear phrases, repeat them, and select correct forms, all without grammar instruction or account creation. A FastAPI backend handles TTS (Sarvam `bulbul:v3`) and STT (`saarika:v2.5`) on demand; the React frontend manages exercise flow and persists all progress in localStorage. The complete system runs without a database.

---

### Narrative

The project began as **BhaashaPath**, a Hindi-only prototype framed around vocabulary acquisition. The first significant decision was reframing: rather than teaching grammar or word lists, the app would teach the phrases people actually use in daily life — ordering chai, asking for directions, agreeing and disagreeing. This framing preceded the exercise design and drove every subsequent content decision.

Expanding from Hindi to six languages was the next architectural commitment. It forced a clean separation between language configuration (speaker mappings, font classes, lesson data paths) and exercise logic — any language-specific value hardcoded in the wrong place became a bug when the second language was added.

Early exercise design included a type-translation exercise where users typed the Hindi equivalent of an English phrase. This was removed and replaced with select-phrase MCQ. The reasoning is visible in the problem: typing in a non-Latin script on a mobile keyboard requires the user to already know the script — which eliminates beginners entirely. Select-phrase solved this by displaying native script alongside Roman transliteration in every option card, making the exercise readable without prior script knowledge.

TTS latency became the dominant UX problem post-MVP. The original implementation fetched a full base64 WAV from the Sarvam API and played it only after the complete response arrived. When perceived wait times proved inconsistent, streaming audio via MediaSource API was implemented — the first audio chunk plays immediately while the rest buffers. iOS required separate handling: WebKit's audio context model requires a user gesture to initiate playback, which interacted poorly with the streaming approach and produced the "audio error flash" bug patched across two commits. The resolution was a gesture-gated audio context initialization isolated per platform.

The XP award and MCQ feedback bugs (fixed in commit `438333b`) appeared late in development, after the core exercise flow was already stable. Vitest tests were added in the commit immediately before the Render deployment was configured — a build-first, test-second trajectory common in compressed timelines. The tests cover progress state and XP accounting, the exact areas where the bugs appeared.

The TTS model upgrade from `bulbul:v2` to `v3` was not optional: v2 speaker names (anushka, abhilash, kavitha in certain contexts) are invalid on v3 and fail at runtime without a clear error. This was discovered in production and locked down by pinning the speaker list explicitly per language.

---

### Technical Reflection

**Constraints encountered.** The Sarvam `bulbul:v3` API accepts only a fixed set of valid speaker names; v2 speakers fail at runtime without a descriptive error, making the failure mode silent during development and visible only in production. iOS WebKit enforces user-gesture requirements for audio context initialization that Chrome does not, creating a class of bugs unreproducible in the primary development browser. The `MediaSource` streaming API is unsupported in older Safari versions, requiring a fallback to the full WAV path — two audio delivery code paths now exist and must both be maintained.

**Resolution patterns.** Streaming TTS reduced perceived latency significantly, but it introduced state complexity: the MediaSource buffer can stall if the backend stops writing before the stream closes, which is why a `/tts` fallback endpoint was preserved alongside the streaming path. The iOS audio context issue was resolved by detecting the platform and deferring audio initialization to the first user interaction — a pattern that requires the exercise UI to be gesture-aware from the start.

**Failure points under scale.** All progress is in localStorage: multi-device use is impossible, clearing browser data resets everything, and there is no recovery path. The backend runs on a single uvicorn worker by default; concurrent TTS requests queue rather than parallelize, so lesson load times degrade linearly with concurrent users. The pronunciation scorer uses bigram similarity — a simple heuristic that works for short phrases but will produce inconsistent scores on longer sentences where word order variations are valid.

**Long-term maintenance considerations.** Adding a new language requires touching five separate locations: the TypeScript union type, the language config map, a new lesson data file, the lessons index, a Google Font import, and a CSS script class. Any partially completed addition produces a language that appears in the selector but fails mid-exercise. The speaker name mapping (language → Sarvam voice) is maintained in application code rather than configuration — a Sarvam API change to speaker availability requires a code change and redeploy. As lesson content expands beyond Hindi's nine lessons, the flat per-language file structure will need splitting or indexing to remain navigable.
