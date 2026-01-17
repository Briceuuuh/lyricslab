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

// =============== TYPES API (correspondant à ton backend) ===============

export interface ApiGenre {
  id: number;
  name: string;
  parent_id: number;
  vanity?: string;
}

export interface ApiAlbumCoverart {
  '100x100'?: string;
  '350x350'?: string;
  '500x500'?: string;
  '800x800'?: string;
}

export interface ApiSong {
  // Basic info
  id: number;
  title: string;
  artist: string;
  artist_id?: number;
  album?: string;
  album_id?: number;
  
  // IDs and identifiers
  isrc?: string;
  mbid?: string;
  spotify_id?: string;
  commontrack_id?: number;
  lyrics_id?: number;
  subtitle_id?: number;
  
  // Metadata
  duration?: number; // in seconds
  rating?: number;
  release_date?: string;
  updated_time?: string;
  num_favourite?: number;
  
  // Features
  has_lyrics?: boolean;
  has_lyrics_crowd?: boolean;
  has_subtitles?: boolean;
  has_richsync?: boolean;
  has_track_structure?: boolean;
  instrumental?: boolean;
  explicit?: boolean;
  restricted?: boolean;
  
  // Genre information
  primary_genres?: ApiGenre[];
  secondary_genres?: ApiGenre[];
  
  // Album artwork (multiple sizes)
  album_coverart?: ApiAlbumCoverart;
  
  // URLs
  share_url?: string;
  edit_url?: string;
  vanity_id?: string;
  
  type: 'song';
}

export interface ApiArtist {
  // Basic info
  id: number;
  name: string;
  vanity_id?: string;
  fq_id?: string;
  
  // IDs
  mbid?: string;
  spotify_id?: string;
  
  // Metadata
  country?: string;
  rating?: number;
  crowd_favourites?: number;
  comment?: string;
  updated_time?: string;
  
  // Dates
  begin_date?: string;
  begin_date_year?: string;
  end_date?: string;
  end_date_year?: string;
  
  // Genres
  primary_genres?: ApiGenre[];
  secondary_genres?: ApiGenre[];
  
  // URLs
  twitter_url?: string;
  website_url?: string;
  instagram_url?: string;
  tiktok_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  share_url?: string;
  
  // Status
  restricted?: boolean;
  managed?: boolean;
  
  // Aliases
  aliases?: { artist_alias: string }[];
  
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

// =============== TYPES FRONTEND ===============

export interface Song {
  id: string;
  title: string;
  artist: string;
  artistId?: number;
  album?: string;
  albumId?: number;
  language: string;
  languageLabel: string;
  difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  albumArt: string;
  albumArtSmall?: string;
  albumArtLarge?: string;
  lyrics: LyricLine[];
  wordFrequency: Record<string, number>;
  slangWords: SlangWord[];
  estimatedLearningTime: number;
  totalWords: number;
  uniqueWords: number;
  difficultyScore?: number;
  difficultyReasoning?: DifficultyReasoning;
  // New fields from API
  genres: string[];
  duration?: number;
  hasLyrics?: boolean;
  spotifyId?: string;
  explicit?: boolean;
  rating?: number;
  releaseDate?: string;
  shareUrl?: string;
}

export interface Artist {
  id: string;
  name: string;
  country?: string;
  genres: string[];
  rating?: number;
  spotifyId?: string;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    website?: string;
  };
  imageUrl?: string;
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

// =============== HELPERS ===============

/**
 * Get the best available album art URL
 */
export function getBestAlbumArt(coverart?: ApiAlbumCoverart, size: 'small' | 'medium' | 'large' = 'medium'): string {
  if (!coverart) return '';
  
  if (size === 'large') {
    return coverart['800x800'] || coverart['500x500'] || coverart['350x350'] || coverart['100x100'] || '';
  }
  if (size === 'small') {
    return coverart['100x100'] || coverart['350x350'] || coverart['500x500'] || coverart['800x800'] || '';
  }
  // medium
  return coverart['350x350'] || coverart['500x500'] || coverart['100x100'] || coverart['800x800'] || '';
}

/**
 * Extract genre names from API genres
 */
export function extractGenreNames(genres?: ApiGenre[]): string[] {
  if (!genres || genres.length === 0) return [];
  return genres.map(g => g.name);
}

/**
 * Convert API song to frontend Song format
 */
export function convertApiSongToSong(apiSong: ApiSong): Song {
  const albumArt = getBestAlbumArt(apiSong.album_coverart, 'medium');
  const genres = extractGenreNames(apiSong.primary_genres);
  
  return {
    id: String(apiSong.id),
    title: apiSong.title,
    artist: apiSong.artist,
    artistId: apiSong.artist_id,
    album: apiSong.album,
    albumId: apiSong.album_id,
    language: 'en', // Default - sera enrichi par le backend NLP
    languageLabel: 'English',
    difficulty: 'B1', // Default - sera calculé par le backend NLP
    albumArt: albumArt || `https://picsum.photos/seed/${apiSong.id}/300/300`,
    albumArtSmall: getBestAlbumArt(apiSong.album_coverart, 'small'),
    albumArtLarge: getBestAlbumArt(apiSong.album_coverart, 'large'),
    lyrics: [],
    wordFrequency: {},
    slangWords: [],
    estimatedLearningTime: apiSong.duration ? Math.ceil(apiSong.duration / 60) + 3 : 8,
    totalWords: 0,
    uniqueWords: 0,
    // New fields
    genres,
    duration: apiSong.duration,
    hasLyrics: apiSong.has_lyrics,
    spotifyId: apiSong.spotify_id,
    explicit: apiSong.explicit,
    rating: apiSong.rating,
    releaseDate: apiSong.release_date,
    shareUrl: apiSong.share_url,
  };
}

/**
 * Convert API artist to frontend Artist format
 */
export function convertApiArtistToArtist(apiArtist: ApiArtist): Artist {
  const genres = extractGenreNames(apiArtist.primary_genres);
  
  return {
    id: String(apiArtist.id),
    name: apiArtist.name,
    country: apiArtist.country,
    genres,
    rating: apiArtist.rating,
    spotifyId: apiArtist.spotify_id || undefined,
    socialLinks: {
      twitter: apiArtist.twitter_url || undefined,
      instagram: apiArtist.instagram_url || undefined,
      facebook: apiArtist.facebook_url || undefined,
      youtube: apiArtist.youtube_url || undefined,
      website: apiArtist.website_url || undefined,
    },
  };
}

// =============== HEALTH API ===============

export const healthApi = {
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

// =============== SEARCH API ===============

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
   * Search for songs
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
  generateFillBlank: async (songId: string, numBlanks = 5) => {
    const response = await api.post<{ success: boolean; challenges: ChallengeQuestion[] }>(
      `/challenges/${songId}/fill-blank`,
      { numBlanks }
    );
    return response.data;
  },

  generateMultipleChoice: async (songId: string, numQuestions = 5) => {
    const response = await api.post<{ success: boolean; questions: ChallengeQuestion[] }>(
      `/challenges/${songId}/multiple-choice`,
      { numQuestions }
    );
    return response.data;
  },

  submitAttempt: async (challengeId: string, answers: string[]) => {
    const response = await api.post<ChallengeAttemptResult>(
      `/challenges/${challengeId}/attempt`,
      { answers }
    );
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<{ success: boolean; challenges: Challenge[] }>('/challenges');
    return response.data;
  },

  getBySong: async (songId: string) => {
    const response = await api.get<{ success: boolean; challenges: Challenge[] }>(`/challenges/song/${songId}`);
    return response.data;
  },
};

// =============== USER API (À IMPLÉMENTER) ===============

export const userApi = {
  getProgress: async () => {
    const response = await api.get<{ success: boolean; progress: UserProgress }>('/user/progress');
    return response.data;
  },

  updateProgress: async (updates: Partial<UserProgress>) => {
    const response = await api.put<{ success: boolean; progress: UserProgress }>('/user/progress', updates);
    return response.data;
  },

  markWordLearned: async (word: string, language: string, songId?: string) => {
    const response = await api.post<{ success: boolean; message: string; wordsLearnedCount: number }>(
      '/user/words/learned',
      { word, language, songId }
    );
    return response.data;
  },

  getLearnedWords: async (language?: string) => {
    const response = await api.get<{ success: boolean; words: string[]; total: number }>('/user/words', {
      params: language ? { language } : undefined,
    });
    return response.data;
  },

  updateSettings: async (settings: { preferredLanguages?: string[]; difficulty?: string }) => {
    const response = await api.post<{ success: boolean; settings: typeof settings }>('/user/settings', settings);
    return response.data;
  },
};

// =============== NLP API (À IMPLÉMENTER) ===============

export const nlpApi = {
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
