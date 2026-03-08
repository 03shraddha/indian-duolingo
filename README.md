# Indian Duolingo — Learn Indian Languages

A Duolingo-style language learning app for India, powered by [Sarvam AI](https://sarvam.ai) APIs.
**V1 scope:** English → Hindi, browser-based, no login required.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Python FastAPI + sarvamai SDK |
| Storage | localStorage (no auth needed) |
| Speech APIs | Sarvam bulbul:v3 (TTS), saarika:v2.5 (STT), mayura:v1 (translate) |

## Running Locally

### 1. Backend (FastAPI)

```bash
cd backend

# Add your API key
cp .env.example .env
# Edit .env and set SARVAM_API_KEY=your_key_here

# Install dependencies
pip install -r requirements.txt

# Start the server (port 8000)
python -m uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000

### 2. Frontend (React)

In a **separate terminal**:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

> The Vite dev server automatically proxies `/api` calls to `http://localhost:8000`,
> so you don't need to worry about CORS during development.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/tts` | Text → Hindi speech (base64 audio) |
| POST | `/api/stt` | Audio blob → Hindi transcript |
| POST | `/api/translate` | Translate text between languages |

## Exercise Types

| Type | Flow |
|------|------|
| Listen & Identify | Hear Hindi audio → pick correct English meaning |
| Speak & Repeat | Read Hindi phrase → record yourself → STT match |
| Type the Translation | See English phrase → type Hindi translation |

## Lesson Content (V1)

- **Unit 1 — Greetings & Basics** (3 lessons)
- **Unit 2 — Numbers & Colors** (3 lessons)
- **Unit 3 — Food & Daily Life** (3 lessons)

Total: 9 lessons, ~50 exercises, English → Hindi.
