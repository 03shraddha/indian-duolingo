import type { Language, Unit } from '../types'
import { units as hindiUnits } from './lessons-hindi'
import { units as kannadaUnits } from './lessons-kannada'
import { units as tamilUnits } from './lessons-tamil'
import { units as teluguUnits } from './lessons-telugu'

export { hindiUnits, kannadaUnits, tamilUnits, teluguUnits }

export const lessonsByLanguage: Record<Language, Unit[]> = {
  hindi: hindiUnits,
  kannada: kannadaUnits,
  tamil: tamilUnits,
  telugu: teluguUnits,
}

export function getAllLessons(language: Language) {
  return lessonsByLanguage[language].flatMap((u) => u.lessons)
}

export function getLessonById(id: string, language: Language) {
  return getAllLessons(language).find((l) => l.id === id) ?? null
}
