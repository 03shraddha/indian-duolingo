import type { Unit } from '../types'

export const units: Unit[] = [
  {
    id: 'te-unit-1',
    title: 'Everyday Conversations',
    emoji: '🙏',
    lessons: [
      {
        id: 'te-1-1',
        title: 'Meeting Someone',
        unitId: 'te-unit-1',
        exercises: [
          {
            // Combined greeting — richer than isolated "Hello"
            id: 'te-e1',
            type: 'listen-identify',
            englishText: 'Hello, how are you?',
            targetText: 'నమస్కారం, ఎలా ఉన్నారు?',
            romanized: 'Namaskaram, ela unnaru?',
            options: ['Hello, how are you?', 'Good morning!', 'Have a nice day!', 'See you soon!'],
          },
          {
            // Fuller gratitude — not just a bare word
            id: 'te-e2',
            type: 'speak-repeat',
            englishText: 'Thank you very much',
            targetText: 'చాలా ధన్యవాదాలు',
            romanized: 'Chaala dhanyavaadaalu',
          },
          {
            // Natural response to the greeting + returns the question
            id: 'te-e3',
            type: 'listen-identify',
            englishText: "I'm fine, and you?",
            targetText: 'నేను బాగున్నాను, మీరు?',
            romanized: 'Nenu baagunnanu, meeru?',
            options: ["I'm fine, and you?", "I'm very tired", "Not so great", "Could be better"],
          },
          {
            // Asking someone's name — natural follow-up after greeting
            id: 'te-e4',
            type: 'speak-repeat',
            englishText: 'What is your name?',
            targetText: 'మీ పేరు ఏమిటి?',
            romanized: 'Mee peru emiti?',
          },
          {
            id: 'te-e5',
            type: 'listen-identify',
            englishText: 'My name is...',
            targetText: 'నా పేరు...',
            romanized: 'Naa peru...',
            options: ['My name is...', 'Your name is...', 'What is your name?', 'I forgot my name'],
          },
        ],
      },
      {
        id: 'te-1-2',
        title: 'Everyday Replies',
        unitId: 'te-unit-1',
        exercises: [
          {
            // Yes in context — not an isolated single word
            id: 'te-e6',
            type: 'listen-identify',
            englishText: 'Yes, alright',
            targetText: 'అవును, సరే',
            romanized: 'Avunu, sare',
            options: ['Yes, alright', 'No, not at all', 'Maybe later', "I'm not sure"],
          },
          {
            // No in context — paired with thanks to feel natural
            id: 'te-e7',
            type: 'speak-repeat',
            englishText: 'No thanks',
            targetText: 'వద్దు, ధన్యవాదాలు',
            romanized: 'Vaddu, dhanyavaadaalu',
          },
          {
            // "Sure, go ahead" — more conversational than bare "OK"
            id: 'te-e8',
            type: 'listen-identify',
            englishText: 'Sure, go ahead',
            targetText: 'సరే, చెప్పండి',
            romanized: 'Sare, cheppandi',
            options: ['Sure, go ahead', 'Stop right there', 'I disagree', 'Not right now'],
          },
          {
            // Sorry combined with "I don't know" — the real phrase you need
            id: 'te-e9',
            type: 'speak-repeat',
            englishText: "Sorry, I don't know",
            targetText: 'సారీ, నాకు తెలియదు',
            romanized: 'Saari, naaku teliyadu',
          },
          {
            id: 'te-e10',
            type: 'listen-identify',
            englishText: 'No problem at all',
            targetText: 'పర్వాలేదు, వదిలేయండి',
            romanized: 'Parvaaledu, vadileeyandi',
            options: ['No problem at all', 'This is a problem', 'Can you help me?', 'What happened?'],
          },
        ],
      },
      {
        id: 'te-1-3',
        title: 'Getting Around',
        unitId: 'te-unit-1',
        exercises: [
          {
            id: 'te-e11',
            type: 'listen-identify',
            englishText: "I didn't understand that",
            targetText: 'నాకు అర్థం కాలేదు',
            romanized: 'Naaku artham kaaledu',
            options: ["I didn't understand that", 'I understood everything', 'Please say it again', 'Speak more slowly'],
          },
          {
            // Replaces "Come here" — far more useful for a learner
            id: 'te-e12',
            type: 'speak-repeat',
            englishText: "I don't know Telugu",
            targetText: 'నాకు తెలుగు రాదు',
            romanized: 'Naaku Telugu raadu',
          },
          {
            id: 'te-e13',
            type: 'listen-identify',
            englishText: 'How much does this cost?',
            targetText: 'ఇది ఎంత?',
            romanized: 'Idi enta?',
            options: ['How much does this cost?', 'Is this for sale?', 'I want to buy this', 'This is too expensive'],
          },
          {
            id: 'te-e14',
            type: 'speak-repeat',
            englishText: 'Where is the toilet?',
            targetText: 'టాయిలెట్ ఎక్కడ ఉంది?',
            romanized: 'Toilet ekkada undi?',
          },
          {
            id: 'te-e15',
            type: 'listen-identify',
            englishText: 'I need help',
            targetText: 'నాకు సహాయం కావాలి',
            romanized: 'Naaku sahaayam kaavaali',
            options: ['I need help', 'I can help you', 'No help needed', 'Help yourself'],
          },
        ],
      },
    ],
  },
]
