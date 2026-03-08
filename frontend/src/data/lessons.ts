import type { Unit } from '../types'

export const units: Unit[] = [
  // ──────────────────────────────────────────────────
  // UNIT 1 — Greetings & Basics
  // ──────────────────────────────────────────────────
  {
    id: 'unit-1',
    title: 'Greetings & Basics',
    emoji: '🙏',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Hello & Goodbye',
        unitId: 'unit-1',
        exercises: [
          {
            id: 'e1',
            type: 'listen-identify',
            englishText: 'Hello',
            hindiText: 'नमस्ते',
            hindiRomanized: 'Namaste',
            options: ['Hello', 'Goodbye', 'Thank you', 'Please'],
          },
          {
            id: 'e2',
            type: 'speak-repeat',
            englishText: 'Goodbye',
            hindiText: 'अलविदा',
            hindiRomanized: 'Alvida',
          },
          {
            id: 'e3',
            type: 'type-translation',
            englishText: 'Please',
            hindiText: 'कृपया',
            hindiRomanized: 'Kripaya',
          },
          {
            id: 'e4',
            type: 'listen-identify',
            englishText: 'Thank you',
            hindiText: 'धन्यवाद',
            hindiRomanized: 'Dhanyavaad',
            options: ['Thank you', 'Sorry', 'Welcome', 'Goodbye'],
          },
          {
            id: 'e5',
            type: 'speak-repeat',
            englishText: 'Welcome',
            hindiText: 'स्वागत है',
            hindiRomanized: 'Swagat hai',
          },
        ],
      },
      {
        id: 'lesson-1-2',
        title: 'Yes & No',
        unitId: 'unit-1',
        exercises: [
          {
            id: 'e6',
            type: 'listen-identify',
            englishText: 'Yes',
            hindiText: 'हाँ',
            hindiRomanized: 'Haan',
            options: ['Yes', 'No', 'Maybe', 'Again'],
          },
          {
            id: 'e7',
            type: 'speak-repeat',
            englishText: 'No',
            hindiText: 'नहीं',
            hindiRomanized: 'Nahin',
          },
          {
            id: 'e8',
            type: 'type-translation',
            englishText: 'Sorry',
            hindiText: 'माफ़ करें',
            hindiRomanized: 'Maaf karein',
          },
          {
            id: 'e9',
            type: 'listen-identify',
            englishText: 'Excuse me',
            hindiText: 'सुनिए',
            hindiRomanized: 'Suniye',
            options: ['Excuse me', 'Goodbye', 'Thank you', 'Please'],
          },
          {
            id: 'e10',
            type: 'speak-repeat',
            englishText: 'Again',
            hindiText: 'फिर से',
            hindiRomanized: 'Phir se',
          },
        ],
      },
      {
        id: 'lesson-1-3',
        title: 'Introductions',
        unitId: 'unit-1',
        exercises: [
          {
            id: 'e11',
            type: 'listen-identify',
            englishText: 'My name is',
            hindiText: 'मेरा नाम है',
            hindiRomanized: 'Mera naam hai',
            options: ['My name is', 'I am from', 'Nice to meet you', 'How are you'],
          },
          {
            id: 'e12',
            type: 'speak-repeat',
            englishText: 'I am from India',
            hindiText: 'मैं भारत से हूँ',
            hindiRomanized: 'Main Bharat se hoon',
          },
          {
            id: 'e13',
            type: 'type-translation',
            englishText: 'Nice to meet you',
            hindiText: 'आपसे मिलकर अच्छा लगा',
            hindiRomanized: 'Aapse milkar achha laga',
          },
          {
            id: 'e14',
            type: 'listen-identify',
            englishText: 'How are you?',
            hindiText: 'आप कैसे हैं?',
            hindiRomanized: 'Aap kaise hain?',
            options: ['How are you?', 'What is this?', 'Where are you?', 'Who are you?'],
          },
          {
            id: 'e15',
            type: 'speak-repeat',
            englishText: 'I am fine',
            hindiText: 'मैं ठीक हूँ',
            hindiRomanized: 'Main theek hoon',
          },
          {
            id: 'e16',
            type: 'type-translation',
            englishText: 'Good morning',
            hindiText: 'सुप्रभात',
            hindiRomanized: 'Suprabhat',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────
  // UNIT 2 — Numbers & Colors
  // ──────────────────────────────────────────────────
  {
    id: 'unit-2',
    title: 'Numbers & Colors',
    emoji: '🔢',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Numbers 1–5',
        unitId: 'unit-2',
        exercises: [
          {
            id: 'e17',
            type: 'listen-identify',
            englishText: 'One',
            hindiText: 'एक',
            hindiRomanized: 'Ek',
            options: ['One', 'Two', 'Three', 'Four'],
          },
          {
            id: 'e18',
            type: 'speak-repeat',
            englishText: 'Two',
            hindiText: 'दो',
            hindiRomanized: 'Do',
          },
          {
            id: 'e19',
            type: 'type-translation',
            englishText: 'Three',
            hindiText: 'तीन',
            hindiRomanized: 'Teen',
          },
          {
            id: 'e20',
            type: 'listen-identify',
            englishText: 'Four',
            hindiText: 'चार',
            hindiRomanized: 'Chaar',
            options: ['Four', 'Five', 'Six', 'Seven'],
          },
          {
            id: 'e21',
            type: 'speak-repeat',
            englishText: 'Five',
            hindiText: 'पाँच',
            hindiRomanized: 'Paanch',
          },
          {
            id: 'e22',
            type: 'type-translation',
            englishText: 'Ten',
            hindiText: 'दस',
            hindiRomanized: 'Das',
          },
          {
            id: 'e23',
            type: 'listen-identify',
            englishText: 'Zero',
            hindiText: 'शून्य',
            hindiRomanized: 'Shoonya',
            options: ['Zero', 'One', 'Two', 'Three'],
          },
        ],
      },
      {
        id: 'lesson-2-2',
        title: 'Colors',
        unitId: 'unit-2',
        exercises: [
          {
            id: 'e24',
            type: 'listen-identify',
            englishText: 'Red',
            hindiText: 'लाल',
            hindiRomanized: 'Laal',
            options: ['Red', 'Blue', 'Green', 'Yellow'],
          },
          {
            id: 'e25',
            type: 'speak-repeat',
            englishText: 'Blue',
            hindiText: 'नीला',
            hindiRomanized: 'Neela',
          },
          {
            id: 'e26',
            type: 'type-translation',
            englishText: 'Green',
            hindiText: 'हरा',
            hindiRomanized: 'Hara',
          },
          {
            id: 'e27',
            type: 'listen-identify',
            englishText: 'Yellow',
            hindiText: 'पीला',
            hindiRomanized: 'Peela',
            options: ['Yellow', 'White', 'Black', 'Orange'],
          },
          {
            id: 'e28',
            type: 'speak-repeat',
            englishText: 'White',
            hindiText: 'सफेद',
            hindiRomanized: 'Safed',
          },
          {
            id: 'e29',
            type: 'type-translation',
            englishText: 'Black',
            hindiText: 'काला',
            hindiRomanized: 'Kaala',
          },
        ],
      },
      {
        id: 'lesson-2-3',
        title: 'Count Objects',
        unitId: 'unit-2',
        exercises: [
          {
            id: 'e30',
            type: 'listen-identify',
            englishText: 'One apple',
            hindiText: 'एक सेब',
            hindiRomanized: 'Ek seb',
            options: ['One apple', 'Two apples', 'Three apples', 'No apples'],
          },
          {
            id: 'e31',
            type: 'speak-repeat',
            englishText: 'Two birds',
            hindiText: 'दो पक्षी',
            hindiRomanized: 'Do pakshi',
          },
          {
            id: 'e32',
            type: 'type-translation',
            englishText: 'Three flowers',
            hindiText: 'तीन फूल',
            hindiRomanized: 'Teen phool',
          },
          {
            id: 'e33',
            type: 'listen-identify',
            englishText: 'Four children',
            hindiText: 'चार बच्चे',
            hindiRomanized: 'Chaar bachche',
            options: ['Four children', 'Five children', 'Three children', 'Two children'],
          },
          {
            id: 'e34',
            type: 'speak-repeat',
            englishText: 'Five stars',
            hindiText: 'पाँच सितारे',
            hindiRomanized: 'Paanch sitare',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────
  // UNIT 3 — Food & Daily Life
  // ──────────────────────────────────────────────────
  {
    id: 'unit-3',
    title: 'Food & Daily Life',
    emoji: '🍛',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'Common Foods',
        unitId: 'unit-3',
        exercises: [
          {
            id: 'e35',
            type: 'listen-identify',
            englishText: 'Bread',
            hindiText: 'रोटी',
            hindiRomanized: 'Roti',
            options: ['Bread', 'Tea', 'Rice', 'Vegetables'],
          },
          {
            id: 'e36',
            type: 'speak-repeat',
            englishText: 'Tea',
            hindiText: 'चाय',
            hindiRomanized: 'Chai',
          },
          {
            id: 'e37',
            type: 'type-translation',
            englishText: 'Vegetables',
            hindiText: 'सब्ज़ी',
            hindiRomanized: 'Sabzi',
          },
          {
            id: 'e38',
            type: 'listen-identify',
            englishText: 'Water',
            hindiText: 'पानी',
            hindiRomanized: 'Paani',
            options: ['Water', 'Food', 'Milk', 'Rice'],
          },
          {
            id: 'e39',
            type: 'speak-repeat',
            englishText: 'Food',
            hindiText: 'खाना',
            hindiRomanized: 'Khaana',
          },
        ],
      },
      {
        id: 'lesson-3-2',
        title: 'Ordering Food',
        unitId: 'unit-3',
        exercises: [
          {
            id: 'e40',
            type: 'listen-identify',
            englishText: 'I want water',
            hindiText: 'मुझे पानी चाहिए',
            hindiRomanized: 'Mujhe paani chahiye',
            options: ['I want water', 'I want food', 'I want tea', 'I want bread'],
          },
          {
            id: 'e41',
            type: 'speak-repeat',
            englishText: 'Give me tea please',
            hindiText: 'कृपया मुझे चाय दीजिए',
            hindiRomanized: 'Kripaya mujhe chai dijiye',
          },
          {
            id: 'e42',
            type: 'type-translation',
            englishText: 'How much does it cost?',
            hindiText: 'इसकी कीमत क्या है?',
            hindiRomanized: 'Iski keemat kya hai?',
          },
          {
            id: 'e43',
            type: 'listen-identify',
            englishText: 'It is delicious',
            hindiText: 'यह बहुत स्वादिष्ट है',
            hindiRomanized: 'Yeh bahut swadisht hai',
            options: ['It is delicious', 'It is expensive', 'It is cheap', 'It is ready'],
          },
          {
            id: 'e44',
            type: 'speak-repeat',
            englishText: 'The bill please',
            hindiText: 'बिल लाइए',
            hindiRomanized: 'Bill laiye',
          },
          {
            id: 'e45',
            type: 'type-translation',
            englishText: 'I am hungry',
            hindiText: 'मुझे भूख लगी है',
            hindiRomanized: 'Mujhe bhookh lagi hai',
          },
        ],
      },
      {
        id: 'lesson-3-3',
        title: 'Daily Actions',
        unitId: 'unit-3',
        exercises: [
          {
            id: 'e46',
            type: 'listen-identify',
            englishText: 'I eat',
            hindiText: 'मैं खाता हूँ',
            hindiRomanized: 'Main khaata hoon',
            options: ['I eat', 'I drink', 'I sleep', 'I go'],
          },
          {
            id: 'e47',
            type: 'speak-repeat',
            englishText: 'I drink water',
            hindiText: 'मैं पानी पीता हूँ',
            hindiRomanized: 'Main paani peeta hoon',
          },
          {
            id: 'e48',
            type: 'type-translation',
            englishText: 'I sleep',
            hindiText: 'मैं सोता हूँ',
            hindiRomanized: 'Main sota hoon',
          },
          {
            id: 'e49',
            type: 'listen-identify',
            englishText: 'I go to work',
            hindiText: 'मैं काम पर जाता हूँ',
            hindiRomanized: 'Main kaam par jaata hoon',
            options: ['I go to work', 'I come home', 'I eat lunch', 'I read a book'],
          },
          {
            id: 'e50',
            type: 'speak-repeat',
            englishText: 'I come home',
            hindiText: 'मैं घर आता हूँ',
            hindiRomanized: 'Main ghar aata hoon',
          },
        ],
      },
    ],
  },
]

// Flat list of all lessons for easy lookup
export const allLessons = units.flatMap((u) => u.lessons)

export function getLessonById(id: string) {
  return allLessons.find((l) => l.id === id) ?? null
}
