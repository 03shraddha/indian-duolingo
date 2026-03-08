import type { Unit } from '../types'

export const units: Unit[] = [
  // ──────────────────────────────────────────────────
  // UNIT 1 — Everyday Responses
  // ──────────────────────────────────────────────────
  {
    id: 'unit-1',
    title: 'Everyday Responses',
    emoji: '💬',
    lessons: [
      {
        id: 'lesson-1-1',
        title: 'Saying Yes & No',
        unitId: 'unit-1',
        exercises: [
          {
            id: 'e1',
            type: 'listen-identify',
            englishText: "I don't need it",
            hindiText: 'नहीं चाहिए',
            hindiRomanized: 'Nahin chahiye',
            options: ["I don't need it", 'Yes, I want it', 'Give me more', 'Not now'],
          },
          {
            id: 'e2',
            type: 'speak-repeat',
            englishText: "Yes, that's fine",
            hindiText: 'हाँ ठीक है',
            hindiRomanized: 'Haan theek hai',
          },
          {
            id: 'e3',
            type: 'type-translation',
            englishText: 'Not right now',
            hindiText: 'अभी नहीं',
            hindiRomanized: 'Abhi nahin',
          },
          {
            id: 'e4',
            type: 'listen-identify',
            englishText: 'Yes, sure',
            hindiText: 'हाँ बिल्कुल',
            hindiRomanized: 'Haan bilkul',
            options: ['Yes, sure', 'No problem', 'Not at all', 'Maybe later'],
          },
          {
            id: 'e5',
            type: 'speak-repeat',
            englishText: "It's okay, no problem",
            hindiText: 'कोई बात नहीं',
            hindiRomanized: 'Koi baat nahin',
          },
        ],
      },
      {
        id: 'lesson-1-2',
        title: 'Quick Replies',
        unitId: 'unit-1',
        exercises: [
          {
            id: 'e6',
            type: 'listen-identify',
            englishText: 'Coming in a minute',
            hindiText: 'एक मिनट में आता हूँ',
            hindiRomanized: 'Ek minute mein aata hoon',
            options: ['Coming in a minute', 'I am leaving now', 'Wait for me', "I'll be late"],
          },
          {
            id: 'e7',
            type: 'speak-repeat',
            englishText: 'Wait a moment',
            hindiText: 'थोड़ा रुको',
            hindiRomanized: 'Thoda ruko',
          },
          {
            id: 'e8',
            type: 'type-translation',
            englishText: "Let's go",
            hindiText: 'चलो',
            hindiRomanized: 'Chalo',
          },
          {
            id: 'e9',
            type: 'listen-identify',
            englishText: 'I understood',
            hindiText: 'समझ गया',
            hindiRomanized: 'Samajh gaya',
            options: ['I understood', "I don't understand", 'Say it again', 'Speak slowly'],
          },
          {
            id: 'e10',
            type: 'speak-repeat',
            englishText: 'I will call you later',
            hindiText: 'बाद में फ़ोन करता हूँ',
            hindiRomanized: 'Baad mein phone karta hoon',
          },
        ],
      },
      {
        id: 'lesson-1-3',
        title: 'Expressing Needs',
        unitId: 'unit-1',
        exercises: [
          {
            id: 'e11',
            type: 'listen-identify',
            englishText: 'I need help',
            hindiText: 'मुझे मदद चाहिए',
            hindiRomanized: 'Mujhe madad chahiye',
            options: ['I need help', 'I can help', 'No help needed', 'Help me please'],
          },
          {
            id: 'e12',
            type: 'speak-repeat',
            englishText: 'I am very tired',
            hindiText: 'मैं बहुत थका हूँ',
            hindiRomanized: 'Main bahut thaka hoon',
          },
          {
            id: 'e13',
            type: 'type-translation',
            englishText: 'I am hungry',
            hindiText: 'मुझे भूख लगी है',
            hindiRomanized: 'Mujhe bhookh lagi hai',
          },
          {
            id: 'e14',
            type: 'listen-identify',
            englishText: "I don't have time",
            hindiText: 'मेरे पास टाइम नहीं है',
            hindiRomanized: 'Mere paas time nahin hai',
            options: ["I don't have time", 'I have free time', 'Give me time', 'What is the time?'],
          },
          {
            id: 'e15',
            type: 'speak-repeat',
            englishText: 'Please hurry up a little',
            hindiText: 'थोड़ा जल्दी करो',
            hindiRomanized: 'Thoda jaldi karo',
          },
          {
            id: 'e16',
            type: 'type-translation',
            englishText: 'I want to sleep',
            hindiText: 'मुझे नींद आ रही है',
            hindiRomanized: 'Mujhe neend aa rahi hai',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────
  // UNIT 2 — Casual Conversation
  // ──────────────────────────────────────────────────
  {
    id: 'unit-2',
    title: 'Casual Conversation',
    emoji: '🗣️',
    lessons: [
      {
        id: 'lesson-2-1',
        title: 'Asking Questions',
        unitId: 'unit-2',
        exercises: [
          {
            id: 'e17',
            type: 'listen-identify',
            englishText: 'Where are you going?',
            hindiText: 'तुम कहाँ जा रहे हो?',
            hindiRomanized: 'Tum kahan ja rahe ho?',
            options: ['Where are you going?', 'Where did you go?', 'Where do you live?', 'Are you going home?'],
          },
          {
            id: 'e18',
            type: 'speak-repeat',
            englishText: 'What are you doing?',
            hindiText: 'तुम क्या कर रहे हो?',
            hindiRomanized: 'Tum kya kar rahe ho?',
          },
          {
            id: 'e19',
            type: 'type-translation',
            englishText: 'When will you come?',
            hindiText: 'तुम कब आओगे?',
            hindiRomanized: 'Tum kab aaoge?',
          },
          {
            id: 'e20',
            type: 'listen-identify',
            englishText: 'Did you eat?',
            hindiText: 'खाना खाया?',
            hindiRomanized: 'Khaana khaya?',
            options: ['Did you eat?', 'Did you cook?', 'Are you eating?', 'What did you eat?'],
          },
          {
            id: 'e21',
            type: 'speak-repeat',
            englishText: 'How was your day?',
            hindiText: 'दिन कैसा रहा?',
            hindiRomanized: 'Din kaisa raha?',
          },
        ],
      },
      {
        id: 'lesson-2-2',
        title: 'Answering Back',
        unitId: 'unit-2',
        exercises: [
          {
            id: 'e22',
            type: 'listen-identify',
            englishText: 'I am going home',
            hindiText: 'मैं घर जा रहा हूँ',
            hindiRomanized: 'Main ghar ja raha hoon',
            options: ['I am going home', 'I came from home', 'I stay at home', 'I left home'],
          },
          {
            id: 'e23',
            type: 'speak-repeat',
            englishText: 'I am working right now',
            hindiText: 'अभी काम कर रहा हूँ',
            hindiRomanized: 'Abhi kaam kar raha hoon',
          },
          {
            id: 'e24',
            type: 'type-translation',
            englishText: 'I will come in the evening',
            hindiText: 'शाम को आऊँगा',
            hindiRomanized: 'Shaam ko aaunga',
          },
          {
            id: 'e25',
            type: 'listen-identify',
            englishText: 'Yes, I just ate',
            hindiText: 'हाँ, अभी खाया',
            hindiRomanized: 'Haan, abhi khaya',
            options: ['Yes, I just ate', 'No, not yet', "I'll eat later", 'I am eating now'],
          },
          {
            id: 'e26',
            type: 'speak-repeat',
            englishText: 'The day was good',
            hindiText: 'दिन अच्छा रहा',
            hindiRomanized: 'Din achha raha',
          },
        ],
      },
      {
        id: 'lesson-2-3',
        title: 'Making Plans',
        unitId: 'unit-2',
        exercises: [
          {
            id: 'e27',
            type: 'listen-identify',
            englishText: 'Shall we meet tomorrow?',
            hindiText: 'कल मिलते हैं?',
            hindiRomanized: 'Kal milte hain?',
            options: ['Shall we meet tomorrow?', 'Did we meet yesterday?', 'Where shall we meet?', 'When did we meet?'],
          },
          {
            id: 'e28',
            type: 'speak-repeat',
            englishText: "Let's go together",
            hindiText: 'साथ चलते हैं',
            hindiRomanized: 'Saath chalte hain',
          },
          {
            id: 'e29',
            type: 'type-translation',
            englishText: 'I will reach by 6',
            hindiText: 'छह बजे तक पहुँचूँगा',
            hindiRomanized: 'Chhah baje tak pahunchunga',
          },
          {
            id: 'e30',
            type: 'listen-identify',
            englishText: "I can't make it today",
            hindiText: 'आज नहीं हो पाएगा',
            hindiRomanized: 'Aaj nahin ho paayega',
            options: ["I can't make it today", 'Today is perfect', 'Let me check', "I'll manage today"],
          },
          {
            id: 'e31',
            type: 'speak-repeat',
            englishText: 'Send me the address',
            hindiText: 'पता भेज दो',
            hindiRomanized: 'Pata bhej do',
          },
        ],
      },
    ],
  },

  // ──────────────────────────────────────────────────
  // UNIT 3 — Real-life Situations
  // ──────────────────────────────────────────────────
  {
    id: 'unit-3',
    title: 'Real-life Situations',
    emoji: '🏙️',
    lessons: [
      {
        id: 'lesson-3-1',
        title: 'At a Chai Stall',
        unitId: 'unit-3',
        exercises: [
          {
            id: 'e32',
            type: 'listen-identify',
            englishText: 'Will you have tea?',
            hindiText: 'चाय लोगे?',
            hindiRomanized: 'Chai loge?',
            options: ['Will you have tea?', 'Did you drink tea?', 'Make me tea', 'I want tea'],
          },
          {
            id: 'e33',
            type: 'speak-repeat',
            englishText: 'Two teas please',
            hindiText: 'दो चाय देना',
            hindiRomanized: 'Do chai dena',
          },
          {
            id: 'e34',
            type: 'type-translation',
            englishText: 'Less sugar',
            hindiText: 'कम चीनी',
            hindiRomanized: 'Kam cheeni',
          },
          {
            id: 'e35',
            type: 'listen-identify',
            englishText: 'How much did it cost?',
            hindiText: 'कितने पैसे हुए?',
            hindiRomanized: 'Kitne paise hue?',
            options: ['How much did it cost?', 'Do you have change?', 'Is it expensive?', 'Keep the change'],
          },
          {
            id: 'e36',
            type: 'speak-repeat',
            englishText: 'The tea is very good',
            hindiText: 'चाय बहुत अच्छी है',
            hindiRomanized: 'Chai bahut achhi hai',
          },
        ],
      },
      {
        id: 'lesson-3-2',
        title: 'At the Market',
        unitId: 'unit-3',
        exercises: [
          {
            id: 'e37',
            type: 'listen-identify',
            englishText: 'What is the price of this?',
            hindiText: 'इसका दाम क्या है?',
            hindiRomanized: 'Iska daam kya hai?',
            options: ['What is the price of this?', 'Is this available?', 'Do you have this?', 'This is too costly'],
          },
          {
            id: 'e38',
            type: 'speak-repeat',
            englishText: 'Give me a little discount',
            hindiText: 'थोड़ा कम करो',
            hindiRomanized: 'Thoda kam karo',
          },
          {
            id: 'e39',
            type: 'type-translation',
            englishText: 'Do you have change?',
            hindiText: 'छुट्टे हैं क्या?',
            hindiRomanized: 'Chutte hain kya?',
          },
          {
            id: 'e40',
            type: 'listen-identify',
            englishText: 'Pack it separately',
            hindiText: 'अलग से पैक करो',
            hindiRomanized: 'Alag se pack karo',
            options: ['Pack it separately', 'Pack it together', 'No need to pack', 'Pack it nicely'],
          },
          {
            id: 'e41',
            type: 'speak-repeat',
            englishText: 'I will come again',
            hindiText: 'फिर आऊँगा',
            hindiRomanized: 'Phir aaunga',
          },
          {
            id: 'e42',
            type: 'type-translation',
            englishText: 'The vegetables are fresh',
            hindiText: 'सब्ज़ी ताज़ी है',
            hindiRomanized: 'Sabzi taazi hai',
          },
        ],
      },
      {
        id: 'lesson-3-3',
        title: 'Getting Things Done',
        unitId: 'unit-3',
        exercises: [
          {
            id: 'e43',
            type: 'listen-identify',
            englishText: 'Please hurry a little',
            hindiText: 'थोड़ा जल्दी करो',
            hindiRomanized: 'Thoda jaldi karo',
            options: ['Please hurry a little', 'Take your time', 'No rush at all', 'Stop rushing'],
          },
          {
            id: 'e44',
            type: 'speak-repeat',
            englishText: 'The work is almost done',
            hindiText: 'काम लगभग हो गया',
            hindiRomanized: 'Kaam lagbhag ho gaya',
          },
          {
            id: 'e45',
            type: 'type-translation',
            englishText: 'Please do it today',
            hindiText: 'आज ही कर देना',
            hindiRomanized: 'Aaj hi kar dena',
          },
          {
            id: 'e46',
            type: 'listen-identify',
            englishText: 'I will get it done',
            hindiText: 'करवा देता हूँ',
            hindiRomanized: 'Karwa deta hoon',
            options: ['I will get it done', "I can't do it", 'Someone else should do it', 'It is already done'],
          },
          {
            id: 'e47',
            type: 'speak-repeat',
            englishText: 'Tell me if there is a problem',
            hindiText: 'कोई दिक्कत हो तो बोलो',
            hindiRomanized: 'Koi dikkat ho toh bolo',
          },
          {
            id: 'e48',
            type: 'type-translation',
            englishText: 'The work is done',
            hindiText: 'काम हो गया',
            hindiRomanized: 'Kaam ho gaya',
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
