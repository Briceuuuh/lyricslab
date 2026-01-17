import axios from 'axios';

// Configure API base URL - change this to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and auth
api.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API] Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// =============== TYPES ===============

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
  slangWords: SlangWord[];
  estimatedLearningTime: number;
  totalWords: number;
  uniqueWords: number;
  difficultyScore?: number;
  difficultyReasoning?: DifficultyReasoning;
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

export interface SlangWord {
  word: string;
  definition: string;
  language: string;
}

export interface DifficultyReasoning {
  vocabScore: number;
  grammarScore: number;
  slangScore: number;
  culturalScore: number;
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
  difficulty?: string;
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

export interface ChallengeAttemptResult {
  success: boolean;
  score: number;
  correct: number;
  total: number;
  points: number;
  feedback: { index: number; correct: boolean; expected?: string }[];
}

// =============== SONG API ===============

export const songApi = {
  /**
   * Search for songs
   * GET /api/songs/search?q=query&language=en&difficulty=B1
   */
  search: async (params: { q?: string; language?: string; difficulty?: string; limit?: number }) => {
    const response = await api.get<{ success: boolean; count: number; songs: Song[] }>('/songs/search', { params });
    return response.data;
  },

  /**
   * Get song by ID with lyrics and analysis
   * GET /api/songs/:songId
   */
  getById: async (songId: string) => {
    const response = await api.get<{ success: boolean; song: Song }>(`/songs/${songId}`);
    return response.data;
  },

  /**
   * Get popular songs for a language
   * GET /api/songs/popular?language=es
   */
  getPopular: async (language?: string) => {
    const response = await api.get<{ success: boolean; songs: Song[] }>('/songs/popular', {
      params: language ? { language } : undefined,
    });
    return response.data;
  },
};

// =============== CHALLENGE API ===============

export const challengeApi = {
  /**
   * Generate fill-the-blank challenge for a song
   * POST /api/challenges/:songId/fill-blank
   */
  generateFillBlank: async (songId: string, numBlanks = 5) => {
    const response = await api.post<{ success: boolean; challenges: ChallengeQuestion[] }>(
      `/challenges/${songId}/fill-blank`,
      { numBlanks }
    );
    return response.data;
  },

  /**
   * Generate multiple choice challenge for a song
   * POST /api/challenges/:songId/multiple-choice
   */
  generateMultipleChoice: async (songId: string, numQuestions = 5) => {
    const response = await api.post<{ success: boolean; questions: ChallengeQuestion[] }>(
      `/challenges/${songId}/multiple-choice`,
      { numQuestions }
    );
    return response.data;
  },

  /**
   * Submit challenge attempt
   * POST /api/challenges/:challengeId/attempt
   */
  submitAttempt: async (challengeId: string, answers: string[]) => {
    const response = await api.post<ChallengeAttemptResult>(
      `/challenges/${challengeId}/attempt`,
      { answers }
    );
    return response.data;
  },

  /**
   * Get all available challenges
   * GET /api/challenges
   */
  getAll: async () => {
    const response = await api.get<{ success: boolean; challenges: Challenge[] }>('/challenges');
    return response.data;
  },

  /**
   * Get challenges for a specific song
   * GET /api/challenges/song/:songId
   */
  getBySong: async (songId: string) => {
    const response = await api.get<{ success: boolean; challenges: Challenge[] }>(`/challenges/song/${songId}`);
    return response.data;
  },
};

// =============== USER API ===============

export const userApi = {
  /**
   * Get user progress
   * GET /api/user/progress
   */
  getProgress: async () => {
    const response = await api.get<{ success: boolean; progress: UserProgress }>('/user/progress');
    return response.data;
  },

  /**
   * Update user progress
   * PUT /api/user/progress
   */
  updateProgress: async (updates: Partial<UserProgress>) => {
    const response = await api.put<{ success: boolean; progress: UserProgress }>('/user/progress', updates);
    return response.data;
  },

  /**
   * Mark word as learned
   * POST /api/user/words/learned
   */
  markWordLearned: async (word: string, language: string, songId?: string) => {
    const response = await api.post<{ success: boolean; message: string; wordsLearnedCount: number }>(
      '/user/words/learned',
      { word, language, songId }
    );
    return response.data;
  },

  /**
   * Get learned words
   * GET /api/user/words?language=es
   */
  getLearnedWords: async (language?: string) => {
    const response = await api.get<{ success: boolean; words: string[]; total: number }>('/user/words', {
      params: language ? { language } : undefined,
    });
    return response.data;
  },

  /**
   * Update user settings
   * POST /api/user/settings
   */
  updateSettings: async (settings: { preferredLanguages?: string[]; difficulty?: string }) => {
    const response = await api.post<{ success: boolean; settings: typeof settings }>('/user/settings', settings);
    return response.data;
  },
};

// =============== NLP API ===============

export const nlpApi = {
  /**
   * Get word explanation
   * POST /api/nlp/explain
   */
  explainWords: async (words: string[], language = 'en') => {
    const response = await api.post<{
      success: boolean;
      wordExplanations: {
        word: string;
        definition: string;
        exampleSentence: string;
        synonyms: string[];
        partOfSpeech: string;
      }[];
    }>('/nlp/explain', { words, language });
    return response.data;
  },

  /**
   * Calculate difficulty for lyrics
   * POST /api/nlp/difficulty
   */
  calculateDifficulty: async (lyrics: string, language = 'en') => {
    const response = await api.post<{
      success: boolean;
      difficulty: string;
      difficultyScore: number;
      reasoning: DifficultyReasoning;
      stats: {
        totalWords: number;
        uniqueWords: number;
        vocabDistribution: Record<string, number>;
        slangPercentage: number;
        slangWords: SlangWord[];
      };
    }>('/nlp/difficulty', { lyrics, language });
    return response.data;
  },
};

export default api;
