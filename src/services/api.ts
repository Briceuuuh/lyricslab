import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Song endpoints
export const songApi = {
  search: async (query: string, language?: string, difficulty?: string) => {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (language) params.append('language', language);
    if (difficulty) params.append('difficulty', difficulty);
    
    const response = await api.get(`/songs/search?${params.toString()}`);
    return response.data;
  },

  getById: async (songId: string) => {
    const response = await api.get(`/songs/${songId}`);
    return response.data;
  },
};

// Challenge endpoints
export const challengeApi = {
  generateFillBlank: async (songId: string) => {
    const response = await api.post(`/challenges/${songId}/fill-blank`);
    return response.data;
  },

  generateMultipleChoice: async (songId: string) => {
    const response = await api.post(`/challenges/${songId}/multiple-choice`);
    return response.data;
  },

  submitAttempt: async (challengeId: string, answers: string[]) => {
    const response = await api.post(`/challenges/${challengeId}/attempt`, { answers });
    return response.data;
  },
};

// User endpoints
export const userApi = {
  getProgress: async () => {
    const response = await api.get('/user/progress');
    return response.data;
  },

  markWordLearned: async (word: string, language: string, songId?: string) => {
    const response = await api.post('/user/words/learned', { word, language, songId });
    return response.data;
  },

  getLearnedWords: async (language?: string) => {
    const params = language ? `?language=${language}` : '';
    const response = await api.get(`/words/learned${params}`);
    return response.data;
  },
};

export default api;
