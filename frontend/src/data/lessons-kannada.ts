import type { Unit } from '../types'

export const units: Unit[] = [
  {
    id: 'kn-unit-1',
    title: 'Everyday Conversations',
    emoji: '🙏',
    lessons: [
      {
        id: 'kn-1-1',
        title: 'Meeting Someone',
        unitId: 'kn-unit-1',
        exercises: [
          {
            // Combined greeting — richer than isolated "Hello"
            id: 'kn-e1',
            type: 'listen-identify',
            englishText: 'Hello, how are you?',
            targetText: 'ನಮಸ್ಕಾರ, ಹೇಗಿದ್ದೀರಾ?',
            romanized: 'Namaskara, hegiddira?',
            options: ['Hello, how are you?', 'Good morning!', 'Have a nice day!', 'See you soon!'],
          },
          {
            // Fuller gratitude — not just a bare word
            id: 'kn-e2',
            type: 'speak-repeat',
            englishText: 'Thank you so much',
            targetText: 'ತುಂಬಾ ಧನ್ಯವಾದ',
            romanized: 'Tumba dhanyavada',
          },
          {
            // Natural response to the greeting + returns the question
            id: 'kn-e3',
            type: 'listen-identify',
            englishText: "I'm fine, and you?",
            targetText: 'ಚೆನ್ನಾಗಿದ್ದೇನೆ, ನೀವು?',
            romanized: 'Chennaagiddene, nivu?',
            options: ["I'm fine, and you?", "I'm very tired", "Not so great", "Could be better"],
          },
          {
            // Asking someone's name — natural follow-up after greeting
            id: 'kn-e4',
            type: 'speak-repeat',
            englishText: 'What is your name?',
            targetText: 'ನಿಮ್ಮ ಹೆಸರೇನು?',
            romanized: 'Nimma hesarenu?',
          },
          {
            id: 'kn-e5',
            type: 'listen-identify',
            englishText: 'My name is...',
            targetText: 'ನನ್ನ ಹೆಸರು...',
            romanized: 'Nanna hesaru...',
            options: ['My name is...', 'Your name is...', 'What is your name?', 'I have no name'],
          },
        ],
      },
      {
        id: 'kn-1-2',
        title: 'Everyday Replies',
        unitId: 'kn-unit-1',
        exercises: [
          {
            // Yes in context — not an isolated single word
            id: 'kn-e6',
            type: 'listen-identify',
            englishText: 'Yes, alright',
            targetText: 'ಹೌದು, ಸರಿ',
            romanized: 'Houdu, sari',
            options: ['Yes, alright', 'No, not at all', 'Maybe later', "I'm not sure"],
          },
          {
            // No in context — paired with thanks to feel natural
            id: 'kn-e7',
            type: 'speak-repeat',
            englishText: 'No thanks',
            targetText: 'ಬೇಡ, ಧನ್ಯವಾದ',
            romanized: 'Beda, dhanyavada',
          },
          {
            // "Sure, go ahead" — more conversational than bare "OK"
            id: 'kn-e8',
            type: 'listen-identify',
            englishText: 'Sure, go ahead',
            targetText: 'ಸರಿ, ಮಾಡಿ',
            romanized: 'Sari, maadi',
            options: ['Sure, go ahead', 'Stop right there', 'I disagree', 'Not right now'],
          },
          {
            // Sorry combined with "I don't know" — the real phrase you need
            id: 'kn-e9',
            type: 'speak-repeat',
            englishText: "Sorry, I don't know",
            targetText: 'ಕ್ಷಮಿಸಿ, ನನಗೆ ಗೊತ್ತಿಲ್ಲ',
            romanized: 'Kshamisi, nanage gottilla',
          },
          {
            id: 'kn-e10',
            type: 'listen-identify',
            englishText: 'No problem at all',
            targetText: 'ಪರವಾಗಿಲ್ಲ, ಬಿಡಿ',
            romanized: 'Paravaagilla, bidi',
            options: ['No problem at all', 'This is a problem', 'Can you help me?', 'What happened?'],
          },
        ],
      },
      {
        id: 'kn-1-3',
        title: 'Getting Around',
        unitId: 'kn-unit-1',
        exercises: [
          {
            id: 'kn-e11',
            type: 'listen-identify',
            englishText: "I didn't understand that",
            targetText: 'ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ',
            romanized: 'Nanage arthavaagalilla',
            options: ["I didn't understand that", 'I understood everything', 'Please say it again', 'Speak more slowly'],
          },
          {
            // Replaces "Come here" — far more useful for a learner
            id: 'kn-e12',
            type: 'speak-repeat',
            englishText: "I don't know Kannada",
            targetText: 'ನನಗೆ ಕನ್ನಡ ಗೊತ್ತಿಲ್ಲ',
            romanized: 'Nanage Kannada gottilla',
          },
          {
            id: 'kn-e13',
            type: 'listen-identify',
            englishText: 'How much does this cost?',
            targetText: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?',
            romanized: 'Idara bele eshtu?',
            options: ['How much does this cost?', 'Is this for sale?', 'I want to buy this', 'This is too expensive'],
          },
          {
            id: 'kn-e14',
            type: 'speak-repeat',
            englishText: 'Where is the toilet?',
            targetText: 'ಟಾಯ್ಲೆಟ್ ಎಲ್ಲಿದೆ?',
            romanized: 'Toilet ellide?',
          },
          {
            id: 'kn-e15',
            type: 'listen-identify',
            englishText: 'I need help',
            targetText: 'ನನಗೆ ಸಹಾಯ ಬೇಕು',
            romanized: 'Nanage sahaaya beku',
            options: ['I need help', 'I can help you', 'No help needed', 'Help yourself'],
          },
        ],
      },
    ],
  },
]
