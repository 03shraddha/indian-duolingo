export type ExerciseType = 'listen-identify' | 'speak-repeat' | 'type-translation'

export interface Exercise {
  id: string
  type: ExerciseType
  englishText: string      // "Hello"
  hindiText: string        // "नमस्ते"
  hindiRomanized: string   // "Namaste" — pronunciation hint shown to user
  options?: string[]       // listen-identify: 4 English choices (includes correct one)
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
