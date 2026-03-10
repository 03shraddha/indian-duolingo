import type { Unit } from '../types'

export const marathiUnits: Unit[] = [
  {
    id: 'mr-unit-1',
    title: 'Everyday Conversations',
    emoji: '🪷',
    lessons: [
      {
        id: 'mr-1-1',
        title: 'Meeting Someone',
        unitId: 'mr-unit-1',
        exercises: [
          {
            // Combined greeting — richer than isolated "Hello"
            id: 'mr-e1',
            type: 'listen-identify',
            englishText: 'Hello, how are you?',
            targetText: 'नमस्कार, कसे आहात?',
            romanized: 'Namaskar, kase aahaat?',
            options: ['Hello, how are you?', 'Good morning!', 'Have a nice day!', 'See you soon!'],
          },
          {
            // Fuller gratitude — not just a bare word
            id: 'mr-e2',
            type: 'speak-repeat',
            englishText: 'Thank you very much',
            targetText: 'खूप धन्यवाद',
            romanized: 'Khup dhanyavaad',
          },
          {
            // Natural response to the greeting + returns the question
            id: 'mr-e3',
            type: 'listen-identify',
            englishText: "I'm fine, and you?",
            targetText: 'मी ठीक आहे, तुम्ही?',
            romanized: 'Mi theek aahe, tumhi?',
            options: ["I'm fine, and you?", "I'm very tired", "Not so great", "Could be better"],
          },
          {
            // Asking someone's name — natural follow-up after greeting
            id: 'mr-e4',
            type: 'speak-repeat',
            englishText: 'What is your name?',
            targetText: 'तुमचं नाव काय आहे?',
            romanized: 'Tumcham naav kaay aahe?',
          },
          {
            id: 'mr-e5',
            type: 'listen-identify',
            englishText: 'My name is...',
            targetText: 'माझं नाव... आहे',
            romanized: 'Maajham naav... aahe',
            options: ['My name is...', 'Your name is...', 'What is your name?', 'I forgot my name'],
          },
        ],
      },
      {
        id: 'mr-1-2',
        title: 'Everyday Replies',
        unitId: 'mr-unit-1',
        exercises: [
          {
            // Yes in context — not an isolated single word
            id: 'mr-e6',
            type: 'listen-identify',
            englishText: 'Yes, alright',
            targetText: 'हो, ठीक आहे',
            romanized: 'Ho, theek aahe',
            options: ['Yes, alright', 'No, not at all', 'Maybe later', "I'm not sure"],
          },
          {
            // No in context — paired with thanks to feel natural
            id: 'mr-e7',
            type: 'speak-repeat',
            englishText: 'No thanks',
            targetText: 'नको, धन्यवाद',
            romanized: 'Nako, dhanyavaad',
          },
          {
            // "Sure, go ahead" — more conversational than bare "OK"
            id: 'mr-e8',
            type: 'listen-identify',
            englishText: 'Sure, go ahead',
            targetText: 'ठीक आहे, सांगा',
            romanized: 'Theek aahe, saanga',
            options: ['Sure, go ahead', 'Stop right there', 'I disagree', 'Not right now'],
          },
          {
            // Sorry combined with "I don't know" — the real phrase you need
            id: 'mr-e9',
            type: 'speak-repeat',
            englishText: "Sorry, I don't know",
            targetText: 'माफ करा, मला माहीत नाही',
            romanized: 'Maaf karaa, malaa maahit naahi',
          },
          {
            id: 'mr-e10',
            type: 'listen-identify',
            englishText: 'No problem at all',
            targetText: 'काही हरकत नाही',
            romanized: 'Kaahi harkat naahi',
            options: ['No problem at all', 'This is a problem', 'Can you help me?', 'What happened?'],
          },
        ],
      },
      {
        id: 'mr-1-3',
        title: 'Getting Around',
        unitId: 'mr-unit-1',
        exercises: [
          {
            id: 'mr-e11',
            type: 'listen-identify',
            englishText: "I didn't understand that",
            targetText: 'मला समजलं नाही',
            romanized: 'Malaa samajlam naahi',
            options: ["I didn't understand that", 'I understood everything', 'Please say it again', 'Speak more slowly'],
          },
          {
            // Replaces "How are you?" — far more useful for a learner
            id: 'mr-e12',
            type: 'speak-repeat',
            englishText: "I don't know Marathi",
            targetText: 'मला मराठी येत नाही',
            romanized: 'Malaa Marathi yet naahi',
          },
          {
            id: 'mr-e13',
            type: 'listen-identify',
            englishText: 'How much does this cost?',
            targetText: 'हे किती रुपयांना आहे?',
            romanized: 'He kiti rupayanaa aahe?',
            options: ['How much does this cost?', 'Is this for sale?', 'I want to buy this', 'This is too expensive'],
          },
          {
            id: 'mr-e14',
            type: 'speak-repeat',
            englishText: 'Where is the toilet?',
            targetText: 'टॉयलेट कुठे आहे?',
            romanized: 'Toilet kuthe aahe?',
          },
          {
            id: 'mr-e15',
            type: 'listen-identify',
            englishText: 'I need help',
            targetText: 'मला मदत हवी आहे',
            romanized: 'Malaa madat havi aahe',
            options: ['I need help', 'I can help you', 'No help needed', 'Help yourself'],
          },
        ],
      },
    ],
  },
]
