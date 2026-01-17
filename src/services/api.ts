import axios from 'axios';

// Configure API base URL - ton backend Flask sur port 5001
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

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

export interface ApiSong {
  id: number;
  title: string;
  artist: string;
  album?: string;
  type: 'song';
}

export interface ApiArtist {
  id: number;
  name: string;
  type: 'artist';
}

export interface SearchResponse {
  success: boolean;
  query: string;
  artists: {
    count: number;
    results: ApiArtist[];
  };
  songs: {
    count: number;
    results: ApiSong[];
  };
}

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

// =============== HEALTH API ===============

export const healthApi = {
  /**
   * Check API health
   * GET /api/health
   */
  check: async () => {
    const response = await api.get<{
      status: string;
      timestamp: string;
      service: string;
      version: string;
    }>('/api/health');
    return response.data;
  },
};

// =============== SEARCH API (EXISTANT) ===============

export const searchApi = {
  /**
   * Search for both artists and songs
   * GET /search?q=query&limit=20
   */
  searchAll: async (query: string, limit = 20) => {
    const response = await api.get<SearchResponse>('/search', {
      params: { q: query, limit },
    });
    return response.data;
  },

  /**
   * Search for songs only
   * GET /search/songs?q=query&limit=20
   */
  searchSongs: async (query: string, limit = 20) => {
    const response = await api.get<{
      success: boolean;
      query: string;
      count: number;
      results: ApiSong[];
    }>('/search/songs', {
      params: { q: query, limit },
    });
    return response.data;
  },

  /**
   * Search for artists only
   * GET /search/artists?q=query&limit=20
   */
  searchArtists: async (query: string, limit = 20) => {
    const response = await api.get<{
      success: boolean;
      query: string;
      count: number;
      results: ApiArtist[];
    }>('/search/artists', {
      params: { q: query, limit },
    });
    return response.data;
  },
};

// =============== SONG API (À IMPLÉMENTER CÔTÉ BACKEND) ===============

export const songApi = {
  /**
   * Search for songs (utilise searchApi en interne)
   * ✅ DISPONIBLE via /search/songs
   */
  search: async (params: { q?: string; language?: string; difficulty?: string; limit?: number }) => {
    if (!params.q) {
      return { success: true, count: 0, songs: [] };
    }
    const response = await searchApi.searchSongs(params.q, params.limit || 20);
    return {
      success: response.success,
      count: response.count,
      songs: response.results,
    };
  },

  /**
   * Get song by ID with lyrics and analysis
   * ❌ À IMPLÉMENTER: GET /songs/:songId
   */
  getById: async (songId: string) => {
    const response = await api.get<{ success: boolean; song: Song }>(`/songs/${songId}`);
    return response.data;
  },

  /**
   * Get lyrics for a song
   * ❌ À IMPLÉMENTER: GET /songs/:songId/lyrics
   */
  getLyrics: async (songId: string) => {
    const response = await api.get<{ success: boolean; lyrics: string; trackId: number }>(`/songs/${songId}/lyrics`);
    return response.data;
  },

  /**
   * Get popular songs for a language
   * ❌ À IMPLÉMENTER: GET /songs/popular?language=es
   */
  getPopular: async (language?: string) => {
    const response = await api.get<{ success: boolean; songs: Song[] }>('/songs/popular', {
      params: language ? { language } : undefined,
    });
    return response.data;
  },
};

// =============== CHALLENGE API (À IMPLÉMENTER) ===============

export const challengeApi = {
  /**
   * Generate fill-the-blank challenge for a song
   * ❌ À IMPLÉMENTER: POST /challenges/:songId/fill-blank
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
   * ❌ À IMPLÉMENTER: POST /challenges/:songId/multiple-choice
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
   * ❌ À IMPLÉMENTER: POST /challenges/:challengeId/attempt
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
   * ❌ À IMPLÉMENTER: GET /challenges
   */
  getAll: async () => {
    const response = await api.get<{ success: boolean; challenges: Challenge[] }>('/challenges');
    return response.data;
  },

  /**
   * Get challenges for a specific song
   * ❌ À IMPLÉMENTER: GET /challenges/song/:songId
   */
  getBySong: async (songId: string) => {
    const response = await api.get<{ success: boolean; challenges: Challenge[] }>(`/challenges/song/${songId}`);
    return response.data;
  },
};

// =============== USER API (À IMPLÉMENTER) ===============

export const userApi = {
  /**
   * Get user progress
   * ❌ À IMPLÉMENTER: GET /user/progress
   */
  getProgress: async () => {
    const response = await api.get<{ success: boolean; progress: UserProgress }>('/user/progress');
    return response.data;
  },

  /**
   * Update user progress
   * ❌ À IMPLÉMENTER: PUT /user/progress
   */
  updateProgress: async (updates: Partial<UserProgress>) => {
    const response = await api.put<{ success: boolean; progress: UserProgress }>('/user/progress', updates);
    return response.data;
  },

  /**
   * Mark word as learned
   * ❌ À IMPLÉMENTER: POST /user/words/learned
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
   * ❌ À IMPLÉMENTER: GET /user/words?language=es
   */
  getLearnedWords: async (language?: string) => {
    const response = await api.get<{ success: boolean; words: string[]; total: number }>('/user/words', {
      params: language ? { language } : undefined,
    });
    return response.data;
  },

  /**
   * Update user settings
   * ❌ À IMPLÉMENTER: POST /user/settings
   */
  updateSettings: async (settings: { preferredLanguages?: string[]; difficulty?: string }) => {
    const response = await api.post<{ success: boolean; settings: typeof settings }>('/user/settings', settings);
    return response.data;
  },
};

// =============== NLP API (À IMPLÉMENTER) ===============

export const nlpApi = {
  /**
   * Get word explanation
   * ❌ À IMPLÉMENTER: POST /nlp/explain
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
   * ❌ À IMPLÉMENTER: POST /nlp/difficulty
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
