import type { Language, Unit } from '../types'
import { units as hindiUnits } from './lessons-hindi'
import { units as kannadaUnits } from './lessons-kannada'
import { units as tamilUnits } from './lessons-tamil'
import { units as teluguUnits } from './lessons-telugu'
import { bengaliUnits } from './lessons-bengali'
import { marathiUnits } from './lessons-marathi'

export { hindiUnits, kannadaUnits, tamilUnits, teluguUnits, bengaliUnits, marathiUnits }

export const lessonsByLanguage: Record<Language, Unit[]> = {
  hindi: hindiUnits,
  kannada: kannadaUnits,
  tamil: tamilUnits,
  telugu: teluguUnits,
  bengali: bengaliUnits,
  marathi: marathiUnits,
}

export function getAllLessons(language: Language) {
  return lessonsByLanguage[language].flatMap((u) => u.lessons)
}

export function getLessonById(id: string, language: Language) {
  return getAllLessons(language).find((l) => l.id === id) ?? null
}
