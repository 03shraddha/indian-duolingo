import type { Unit } from '../types'

export const units: Unit[] = [
  {
    id: 'ta-unit-1',
    title: 'Everyday Conversations',
    emoji: '🙏',
    lessons: [
      {
        id: 'ta-1-1',
        title: 'Meeting Someone',
        unitId: 'ta-unit-1',
        exercises: [
          {
            // Combined greeting — richer than isolated "Hello"
            id: 'ta-e1',
            type: 'listen-identify',
            englishText: 'Hello, how are you?',
            targetText: 'வணக்கம், எப்படி இருக்கீங்க?',
            romanized: 'Vanakkam, eppadi irukkinga?',
            options: ['Hello, how are you?', 'Good morning!', 'Have a nice day!', 'See you soon!'],
          },
          {
            // Fuller gratitude — not just a bare word
            id: 'ta-e2',
            type: 'speak-repeat',
            englishText: 'Thank you so much',
            targetText: 'ரொம்ப நன்றி',
            romanized: 'Romba nandri',
          },
          {
            // Natural response to the greeting + returns the question
            id: 'ta-e3',
            type: 'select-phrase',
            englishText: "I'm well, and you?",
            targetText: 'நல்லா இருக்கேன், நீங்க?',
            romanized: 'Nalla irukken, ninga?',
            options: ['நல்லா இருக்கேன், நீங்க?', 'வணக்கம், எப்படி இருக்கீங்க?', 'ரொம்ப நன்றி', 'என் பெயர்...'],
            optionsRomanized: ['Nalla irukken, ninga?', 'Vanakkam, eppadi irukkinga?', 'Romba nandri', 'En peyar...'],
          },
          {
            // Asking someone's name — natural follow-up after greeting
            id: 'ta-e4',
            type: 'speak-repeat',
            englishText: 'What is your name?',
            targetText: 'உங்க பேர் என்ன?',
            romanized: 'Unga per enna?',
          },
          {
            id: 'ta-e5',
            type: 'listen-identify',
            englishText: 'My name is...',
            targetText: 'என் பெயர்...',
            romanized: 'En peyar...',
            options: ['My name is...', 'Your name is...', 'What is your name?', 'I forgot my name'],
          },
        ],
      },
      {
        id: 'ta-1-2',
        title: 'Everyday Replies',
        unitId: 'ta-unit-1',
        exercises: [
          {
            // Yes in context — not an isolated single word
            id: 'ta-e6',
            type: 'listen-identify',
            englishText: 'Yes, sure',
            targetText: 'ஆமாம், சரி',
            romanized: 'Aamam, sari',
            options: ['Yes, sure', 'No, not at all', 'Maybe later', "I'm not sure"],
          },
          {
            // No in context — paired with thanks to feel natural
            id: 'ta-e7',
            type: 'speak-repeat',
            englishText: 'No thanks',
            targetText: 'வேண்டாம், நன்றி',
            romanized: 'Vendaam, nandri',
          },
          {
            // "Sure, go ahead" — more conversational than bare "OK"
            id: 'ta-e8',
            type: 'select-phrase',
            englishText: 'Sure, go ahead',
            targetText: 'சரி, சொல்லு',
            romanized: 'Sari, sollu',
            options: ['சரி, சொல்லு', 'ஆமாம், சரி', 'வேண்டாம், நன்றி', 'பரவாயில்லை, விடுங்க'],
            optionsRomanized: ['Sari, sollu', 'Aamam, sari', 'Vendaam, nandri', 'Paravaayillai, vidunga'],
          },
          {
            // Sorry combined with "I don't know" — the real phrase you need
            id: 'ta-e9',
            type: 'speak-repeat',
            englishText: "Sorry, I don't know",
            targetText: 'சாரி, தெரியல',
            romanized: 'Saari, theriyala',
          },
          {
            id: 'ta-e10',
            type: 'listen-identify',
            englishText: 'No problem at all',
            targetText: 'பரவாயில்லை, விடுங்க',
            romanized: 'Paravaayillai, vidunga',
            options: ['No problem at all', 'This is a problem', 'Can you help me?', 'What happened?'],
          },
        ],
      },
      {
        id: 'ta-1-3',
        title: 'Getting Around',
        unitId: 'ta-unit-1',
        exercises: [
          {
            id: 'ta-e11',
            type: 'listen-identify',
            englishText: "I didn't understand that",
            targetText: 'புரியல, மீண்டும் சொல்லுங்க',
            romanized: 'Puriyala, meendum sollunga',
            options: ["I didn't understand that", 'I understood everything', 'Please say it again', 'Speak more slowly'],
          },
          {
            // Replaces "Come here" — far more useful for a learner
            id: 'ta-e12',
            type: 'speak-repeat',
            englishText: "I don't know Tamil",
            targetText: 'எனக்கு தமிழ் தெரியாது',
            romanized: 'Enakku Tamil theriyaadhu',
          },
          {
            id: 'ta-e13',
            type: 'select-phrase',
            englishText: 'How much does this cost?',
            targetText: 'இதன் விலை என்ன?',
            romanized: 'Ithan vilai enna?',
            options: ['இதன் விலை என்ன?', 'புரியல, மீண்டும் சொல்லுங்க', 'எனக்கு தமிழ் தெரியாது', 'எனக்கு உதவி வேணும்'],
            optionsRomanized: ['Ithan vilai enna?', 'Puriyala, meendum sollunga', 'Enakku Tamil theriyaadhu', 'Enakku udhavi venum'],
          },
          {
            id: 'ta-e14',
            type: 'speak-repeat',
            englishText: 'Where is the toilet?',
            targetText: 'டாய்லெட் எங்க இருக்கு?',
            romanized: 'Toilet enga irukku?',
          },
          {
            id: 'ta-e15',
            type: 'listen-identify',
            englishText: 'I need help',
            targetText: 'எனக்கு உதவி வேணும்',
            romanized: 'Enakku udhavi venum',
            options: ['I need help', 'I can help you', 'No help needed', 'Help yourself'],
          },
        ],
      },
    ],
  },
]
