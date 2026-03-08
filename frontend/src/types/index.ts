export type ExerciseType = 'listen-identify' | 'speak-repeat' | 'type-translation'

export interface Exercise {
  id: string
  type: ExerciseType
  englishText: string
  targetText: string      // phrase in the target language script (was hindiText)
  romanized: string       // pronunciation hint in Roman letters (was hindiRomanized)
  options?: string[]      // listen-identify: 4 English choices (includes correct one)
}

export interface Lesson {
  id: string
  title: string
  unitId: string
  exercises: Exercise[]
}

export interface Unit {
  id: string
  title: string
  emoji: string
  lessons: Lesson[]
}

export interface Progress {
  completedLessons: string[]  // lesson IDs
  currentStreak: number
  lastPlayedDate: string      // ISO date "YYYY-MM-DD"
  totalXP: number
}

// ── Multi-language support ────────────────────────────────────────────────────

export type Language = 'hindi' | 'kannada' | 'tamil' | 'telugu'

export interface LanguageConfig {
  name: string              // "Hindi"
  nativeName: string        // "हिंदी"
  greeting: string          // greeting in script, shown on home
  subheading: string        // tagline in English
  languageCode: string      // Sarvam API code, e.g. "hi-IN"
  ttsDefaultSpeaker: string // Sarvam TTS speaker name
  scriptClass: string       // CSS class for script font
  emoji: string             // decorative emoji for language card
  wellDoneText: string      // "शाबाश!" equivalent per language
}

export const LANGUAGE_CONFIG: Record<Language, LanguageConfig> = {
  hindi: {
    name: 'Hindi',
    nativeName: 'हिंदी',
    greeting: 'नमस्ते',
    subheading: 'Learn everyday Hindi. Not textbook Hindi.',
    languageCode: 'hi-IN',
    ttsDefaultSpeaker: 'anushka',
    scriptClass: 'devanagari',
    emoji: '🙏',
    wellDoneText: 'शाबाश!',
  },
  kannada: {
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    greeting: 'ನಮಸ್ಕಾರ',
    subheading: 'Learn everyday Kannada. Not textbook Kannada.',
    languageCode: 'kn-IN',
    ttsDefaultSpeaker: 'kavitha',
    scriptClass: 'kannada-script',
    emoji: '🌸',
    wellDoneText: 'ಶಾಬಾಶ್!',
  },
  tamil: {
    name: 'Tamil',
    nativeName: 'தமிழ்',
    greeting: 'வணக்கம்',
    subheading: 'Learn everyday Tamil. Not textbook Tamil.',
    languageCode: 'ta-IN',
    ttsDefaultSpeaker: 'kavitha',
    scriptClass: 'tamil-script',
    emoji: '🌺',
    wellDoneText: 'சாபாஷ்!',
  },
  telugu: {
    name: 'Telugu',
    nativeName: 'తెలుగు',
    greeting: 'నమస్కారం',
    subheading: 'Learn everyday Telugu. Not textbook Telugu.',
    languageCode: 'te-IN',
    ttsDefaultSpeaker: 'kavitha',
    scriptClass: 'telugu-script',
    emoji: '🌼',
    wellDoneText: 'శభాష్!',
  },
}
