// Mock data for LyricLab MVP

export interface Song {
  id: string;
  title: string;
  artist: string;
  language: string;
  languageLabel: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  albumArt: string;
  lyrics: LyricLine[];
  wordFrequency: Record<string, number>;
  slangWords: string[];
  estimatedLearningTime: number;
  totalWords: number;
  uniqueWords: number;
}

export interface LyricLine {
  original: string;
  translation: string;
  words: Word[];
}

export interface Word {
  text: string;
  translation: string;
  definition: string;
  partOfSpeech: string;
  type: 'common' | 'slang' | 'advanced' | 'argot';
  frequency: number;
}

export interface UserProgress {
  totalWordsLearned: number;
  currentStreak: number;
  totalPoints: number;
  level: number;
  languages: Record<string, number>;
  weeklyProgress: { day: string; words: number; points: number }[];
  wordsKnown: string[];
  wordsLearning: string[];
  wordsToReview: string[];
}

export interface Challenge {
  id: string;
  type: 'fill_blank' | 'multiple_choice' | 'word_association';
  songId: string;
  songTitle: string;
  questions: ChallengeQuestion[];
}

export interface ChallengeQuestion {
  id: string;
  lyricLine: string;
  blanks?: string[];
  correctAnswer: string;
  options?: string[];
  points: number;
}

export const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', label: 'French', flag: '🇫🇷' },
  { code: 'de', label: 'German', flag: '🇩🇪' },
  { code: 'it', label: 'Italian', flag: '🇮🇹' },
  { code: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', label: 'Korean', flag: '🇰🇷' },
  { code: 'zh', label: 'Mandarin', flag: '🇨🇳' },
  { code: 'ru', label: 'Russian', flag: '🇷🇺' },
  { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
  { code: 'nl', label: 'Dutch', flag: '🇳🇱' },
];

export const difficultyColors: Record<string, { bg: string; text: string }> = {
  A1: { bg: 'bg-success/20', text: 'text-success' },
  A2: { bg: 'bg-success/30', text: 'text-success' },
  B1: { bg: 'bg-warning/20', text: 'text-warning' },
  B2: { bg: 'bg-warning/30', text: 'text-warning' },
  C1: { bg: 'bg-accent/20', text: 'text-accent' },
  C2: { bg: 'bg-destructive/20', text: 'text-destructive' },
};

export const mockSongs: Song[] = [
  {
    id: 'song_001',
    title: 'La Vie En Rose',
    artist: 'Édith Piaf',
    language: 'fr',
    languageLabel: 'French',
    difficulty: 'B1',
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    estimatedLearningTime: 8,
    totalWords: 156,
    uniqueWords: 78,
    slangWords: ['bonheur'],
    wordFrequency: { 'vie': 5, 'rose': 3, 'amour': 4 },
    lyrics: [
      {
        original: "Des yeux qui font baisser les miens",
        translation: "Eyes that make mine lower",
        words: [
          { text: "yeux", translation: "eyes", definition: "The organs of sight", partOfSpeech: "noun", type: "common", frequency: 3 },
          { text: "baisser", translation: "to lower", definition: "To move to a lower position", partOfSpeech: "verb", type: "common", frequency: 2 },
        ]
      },
      {
        original: "Un rire qui se perd sur sa bouche",
        translation: "A laugh that is lost on his lips",
        words: [
          { text: "rire", translation: "laugh", definition: "The sound of laughing", partOfSpeech: "noun", type: "common", frequency: 1 },
          { text: "bouche", translation: "mouth", definition: "The opening in the face", partOfSpeech: "noun", type: "common", frequency: 2 },
        ]
      },
      {
        original: "Voilà le portrait sans retouche",
        translation: "That's the portrait without retouching",
        words: [
          { text: "portrait", translation: "portrait", definition: "A painting or photograph of a person", partOfSpeech: "noun", type: "common", frequency: 1 },
          { text: "retouche", translation: "retouching", definition: "The act of improving or correcting", partOfSpeech: "noun", type: "advanced", frequency: 1 },
        ]
      },
    ]
  },
  {
    id: 'song_002',
    title: 'Despacito',
    artist: 'Luis Fonsi',
    language: 'es',
    languageLabel: 'Spanish',
    difficulty: 'A2',
    albumArt: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    estimatedLearningTime: 6,
    totalWords: 245,
    uniqueWords: 112,
    slangWords: ['pasito', 'suavecito'],
    wordFrequency: { 'despacito': 12, 'quiero': 8, 'corazón': 5 },
    lyrics: [
      {
        original: "Quiero respirar tu cuello despacito",
        translation: "I want to breathe your neck slowly",
        words: [
          { text: "quiero", translation: "I want", definition: "First person singular of querer (to want)", partOfSpeech: "verb", type: "common", frequency: 8 },
          { text: "respirar", translation: "to breathe", definition: "To inhale and exhale air", partOfSpeech: "verb", type: "common", frequency: 3 },
          { text: "cuello", translation: "neck", definition: "The part connecting head to body", partOfSpeech: "noun", type: "common", frequency: 2 },
          { text: "despacito", translation: "slowly", definition: "At a slow pace, gently", partOfSpeech: "adverb", type: "slang", frequency: 12 },
        ]
      },
      {
        original: "Deja que te diga cosas al oído",
        translation: "Let me tell you things in your ear",
        words: [
          { text: "deja", translation: "let", definition: "Allow or permit", partOfSpeech: "verb", type: "common", frequency: 4 },
          { text: "oído", translation: "ear", definition: "The organ of hearing", partOfSpeech: "noun", type: "common", frequency: 2 },
        ]
      },
    ]
  },
  {
    id: 'song_003',
    title: '99 Luftballons',
    artist: 'Nena',
    language: 'de',
    languageLabel: 'German',
    difficulty: 'B2',
    albumArt: 'https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=300&h=300&fit=crop',
    estimatedLearningTime: 12,
    totalWords: 320,
    uniqueWords: 145,
    slangWords: [],
    wordFrequency: { 'luftballons': 8, 'krieg': 4, 'welt': 3 },
    lyrics: [
      {
        original: "Hast du etwas Zeit für mich?",
        translation: "Do you have some time for me?",
        words: [
          { text: "Zeit", translation: "time", definition: "The indefinite continued progress of existence", partOfSpeech: "noun", type: "common", frequency: 5 },
          { text: "etwas", translation: "some/something", definition: "An unspecified amount", partOfSpeech: "pronoun", type: "common", frequency: 3 },
        ]
      },
    ]
  },
  {
    id: 'song_004',
    title: 'Bella Ciao',
    artist: 'Traditional',
    language: 'it',
    languageLabel: 'Italian',
    difficulty: 'A1',
    albumArt: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=300&fit=crop',
    estimatedLearningTime: 5,
    totalWords: 120,
    uniqueWords: 45,
    slangWords: [],
    wordFrequency: { 'bella': 10, 'ciao': 10, 'mattina': 4 },
    lyrics: [
      {
        original: "Una mattina mi sono svegliato",
        translation: "One morning I woke up",
        words: [
          { text: "mattina", translation: "morning", definition: "The period from sunrise to noon", partOfSpeech: "noun", type: "common", frequency: 4 },
          { text: "svegliato", translation: "woke up", definition: "Past participle of svegliarsi (to wake up)", partOfSpeech: "verb", type: "common", frequency: 2 },
        ]
      },
      {
        original: "O bella ciao, bella ciao, bella ciao ciao ciao",
        translation: "Oh goodbye beautiful, goodbye beautiful, goodbye goodbye goodbye",
        words: [
          { text: "bella", translation: "beautiful", definition: "Pleasing to the senses or mind", partOfSpeech: "adjective", type: "common", frequency: 10 },
          { text: "ciao", translation: "hello/goodbye", definition: "Italian greeting", partOfSpeech: "interjection", type: "common", frequency: 10 },
        ]
      },
    ]
  },
  {
    id: 'song_005',
    title: 'Shape of You',
    artist: 'Ed Sheeran',
    language: 'en',
    languageLabel: 'English',
    difficulty: 'A2',
    albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    estimatedLearningTime: 7,
    totalWords: 280,
    uniqueWords: 98,
    slangWords: ['wanna', 'gonna'],
    wordFrequency: { 'love': 6, 'body': 8, 'shape': 4 },
    lyrics: [
      {
        original: "I'm in love with the shape of you",
        translation: "I'm in love with the shape of you",
        words: [
          { text: "love", translation: "love", definition: "An intense feeling of deep affection", partOfSpeech: "noun", type: "common", frequency: 6 },
          { text: "shape", translation: "shape", definition: "The external form or outline", partOfSpeech: "noun", type: "common", frequency: 4 },
        ]
      },
      {
        original: "We push and pull like a magnet do",
        translation: "We push and pull like a magnet do",
        words: [
          { text: "push", translation: "push", definition: "To exert force to move away", partOfSpeech: "verb", type: "common", frequency: 2 },
          { text: "pull", translation: "pull", definition: "To exert force to move towards", partOfSpeech: "verb", type: "common", frequency: 2 },
          { text: "magnet", translation: "magnet", definition: "A piece of material that attracts iron", partOfSpeech: "noun", type: "common", frequency: 1 },
        ]
      },
    ]
  },
  {
    id: 'song_006',
    title: 'Gangnam Style',
    artist: 'PSY',
    language: 'ko',
    languageLabel: 'Korean',
    difficulty: 'C1',
    albumArt: 'https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=300&h=300&fit=crop',
    estimatedLearningTime: 15,
    totalWords: 200,
    uniqueWords: 85,
    slangWords: ['오빠'],
    wordFrequency: { '강남': 6, '스타일': 6 },
    lyrics: [
      {
        original: "오빤 강남스타일",
        translation: "Oppa is Gangnam style",
        words: [
          { text: "오빤", translation: "oppa", definition: "Term of endearment for older brother/boyfriend", partOfSpeech: "noun", type: "slang", frequency: 4 },
          { text: "강남", translation: "Gangnam", definition: "Affluent district in Seoul", partOfSpeech: "noun", type: "common", frequency: 6 },
          { text: "스타일", translation: "style", definition: "A manner of doing something", partOfSpeech: "noun", type: "common", frequency: 6 },
        ]
      },
    ]
  },
];

export const mockUserProgress: UserProgress = {
  totalWordsLearned: 243,
  currentStreak: 7,
  totalPoints: 4520,
  level: 15,
  languages: {
    Spanish: 120,
    French: 95,
    Italian: 28,
    German: 0,
  },
  weeklyProgress: [
    { day: 'Mon', words: 12, points: 45 },
    { day: 'Tue', words: 8, points: 30 },
    { day: 'Wed', words: 15, points: 65 },
    { day: 'Thu', words: 0, points: 0 },
    { day: 'Fri', words: 20, points: 95 },
    { day: 'Sat', words: 18, points: 80 },
    { day: 'Sun', words: 5, points: 25 },
  ],
  wordsKnown: ['quiero', 'corazón', 'amor', 'vida', 'bella', 'ciao'],
  wordsLearning: ['despacito', 'respirar', 'yeux', 'bouche'],
  wordsToReview: ['retouche', 'baisser'],
};

export const mockChallenges: Challenge[] = [
  {
    id: 'challenge_001',
    type: 'fill_blank',
    songId: 'song_002',
    songTitle: 'Despacito - Luis Fonsi',
    questions: [
      {
        id: 'q1',
        lyricLine: "Quiero _____ tu cuello despacito",
        blanks: ['respirar'],
        correctAnswer: 'respirar',
        points: 10,
      },
      {
        id: 'q2',
        lyricLine: "Deja que te diga cosas al _____",
        blanks: ['oído'],
        correctAnswer: 'oído',
        points: 10,
      },
    ],
  },
  {
    id: 'challenge_002',
    type: 'multiple_choice',
    songId: 'song_001',
    songTitle: 'La Vie En Rose - Édith Piaf',
    questions: [
      {
        id: 'q1',
        lyricLine: "Des yeux qui font baisser les miens",
        correctAnswer: 'Eyes that make mine lower',
        options: [
          'Eyes that make mine lower',
          'Eyes that make me cry',
          'Eyes full of tears',
          'Beautiful blue eyes',
        ],
        points: 15,
      },
      {
        id: 'q2',
        lyricLine: "Un rire qui se perd sur sa bouche",
        correctAnswer: 'A laugh that is lost on his lips',
        options: [
          'A laugh that is lost on his lips',
          'A smile on her face',
          'A cry from her heart',
          'A song from her mouth',
        ],
        points: 15,
      },
    ],
  },
];

export const achievements = [
  { id: 'first_song', name: 'First Song Completed', icon: '⭐', unlocked: true },
  { id: 'ten_words', name: '10 Words Learned', icon: '📚', unlocked: true },
  { id: 'seven_streak', name: '7-Day Streak', icon: '🔥', unlocked: true },
  { id: 'polyglot', name: 'Polyglot (3+ Languages)', icon: '🌍', unlocked: false },
  { id: 'challenge_creator', name: 'Challenge Creator', icon: '🎨', unlocked: false },
  { id: 'hundred_words', name: '100 Words Mastered', icon: '💯', unlocked: true },
];
