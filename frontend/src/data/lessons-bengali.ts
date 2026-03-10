import type { Unit } from '../types'

export const bengaliUnits: Unit[] = [
  {
    id: 'bn-unit-1',
    title: 'Everyday Conversations',
    emoji: '🌿',
    lessons: [
      {
        id: 'bn-1-1',
        title: 'Meeting Someone',
        unitId: 'bn-unit-1',
        exercises: [
          {
            // Combined greeting — richer than isolated "Hello"
            id: 'bn-e1',
            type: 'listen-identify',
            englishText: 'Hello, how are you?',
            targetText: 'নমস্কার, কেমন আছেন?',
            romanized: 'Namaskar, kemon achen?',
            options: ['Hello, how are you?', 'Good morning!', 'Have a nice day!', 'See you soon!'],
          },
          {
            // Fuller gratitude — not just a bare word
            id: 'bn-e2',
            type: 'speak-repeat',
            englishText: 'Thank you very much',
            targetText: 'অনেক ধন্যবাদ',
            romanized: 'Onek dhanyabad',
          },
          {
            // Natural response to the greeting + returns the question
            id: 'bn-e3',
            type: 'select-phrase',
            englishText: "I'm fine, and you?",
            targetText: 'ভালো আছি, আপনি?',
            romanized: 'Bhalo achi, aapni?',
            options: ['ভালো আছি, আপনি?', 'নমস্কার, কেমন আছেন?', 'অনেক ধন্যবাদ', 'আমার নাম...'],
            optionsRomanized: ['Bhalo achi, aapni?', 'Namaskar, kemon achen?', 'Onek dhanyabad', 'Aamar naam...'],
          },
          {
            // Asking someone's name — natural follow-up after greeting
            id: 'bn-e4',
            type: 'speak-repeat',
            englishText: 'What is your name?',
            targetText: 'আপনার নাম কী?',
            romanized: 'Apnar naam ki?',
          },
          {
            id: 'bn-e5',
            type: 'listen-identify',
            englishText: 'My name is...',
            targetText: 'আমার নাম...',
            romanized: 'Aamar naam...',
            options: ['My name is...', 'Your name is...', 'What is your name?', 'I forgot my name'],
          },
        ],
      },
      {
        id: 'bn-1-2',
        title: 'Everyday Replies',
        unitId: 'bn-unit-1',
        exercises: [
          {
            // Yes in context — not an isolated single word
            id: 'bn-e6',
            type: 'listen-identify',
            englishText: 'Yes, alright',
            targetText: 'হ্যাঁ, ঠিক আছে',
            romanized: 'Hyan, thik ache',
            options: ['Yes, alright', 'No, not at all', 'Maybe later', "I'm not sure"],
          },
          {
            // No in context — paired with thanks to feel natural
            id: 'bn-e7',
            type: 'speak-repeat',
            englishText: 'No thanks',
            targetText: 'না, ধন্যবাদ',
            romanized: 'Na, dhanyabad',
          },
          {
            // "Sure, go ahead" — more conversational than bare "OK"
            id: 'bn-e8',
            type: 'select-phrase',
            englishText: 'Sure, go ahead',
            targetText: 'ঠিক আছে, বলুন',
            romanized: 'Thik ache, bolun',
            options: ['ঠিক আছে, বলুন', 'হ্যাঁ, ঠিক আছে', 'না, ধন্যবাদ', 'কোনো সমস্যা নেই'],
            optionsRomanized: ['Thik ache, bolun', 'Hyan, thik ache', 'Na, dhanyabad', 'Kono shomoshya nei'],
          },
          {
            // Sorry combined with "I don't know" — the real phrase you need
            id: 'bn-e9',
            type: 'speak-repeat',
            englishText: "Sorry, I don't know",
            targetText: 'মাফ করবেন, আমি জানি না',
            romanized: 'Maaf korben, aami jaani na',
          },
          {
            id: 'bn-e10',
            type: 'listen-identify',
            englishText: 'No problem at all',
            targetText: 'কোনো সমস্যা নেই',
            romanized: 'Kono shomoshya nei',
            options: ['No problem at all', 'This is a problem', 'Can you help me?', 'What happened?'],
          },
        ],
      },
      {
        id: 'bn-1-3',
        title: 'Getting Around',
        unitId: 'bn-unit-1',
        exercises: [
          {
            id: 'bn-e11',
            type: 'listen-identify',
            englishText: "I didn't understand that",
            targetText: 'বুঝতে পারছি না',
            romanized: 'Bujhte parchi na',
            options: ["I didn't understand that", 'I understood everything', 'Please say it again', 'Speak more slowly'],
          },
          {
            // Replaces bare "How are you?" — far more useful for a learner
            id: 'bn-e12',
            type: 'speak-repeat',
            englishText: "I don't know Bengali",
            targetText: 'আমি বাংলা জানি না',
            romanized: 'Aami Bangla jaani na',
          },
          {
            id: 'bn-e13',
            type: 'select-phrase',
            englishText: 'How much does this cost?',
            targetText: 'এটার দাম কত?',
            romanized: 'Etar daam koto?',
            options: ['এটার দাম কত?', 'বুঝতে পারছি না', 'আমি বাংলা জানি না', 'আমার সাহায্য দরকার'],
            optionsRomanized: ['Etar daam koto?', 'Bujhte parchi na', 'Aami Bangla jaani na', 'Aamar shahaajyo dorkar'],
          },
          {
            id: 'bn-e14',
            type: 'speak-repeat',
            englishText: 'Where is the toilet?',
            targetText: 'টয়লেট কোথায়?',
            romanized: 'Toilet kothai?',
          },
          {
            id: 'bn-e15',
            type: 'listen-identify',
            englishText: 'I need help',
            targetText: 'আমার সাহায্য দরকার',
            romanized: 'Aamar shahaajyo dorkar',
            options: ['I need help', 'I can help you', 'No help needed', 'Help yourself'],
          },
        ],
      },
    ],
  },
]
