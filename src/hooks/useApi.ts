import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { songApi, challengeApi, userApi } from '@/services/api';
import { Song, Challenge } from '@/data/mockData';

// Transform API response to match frontend Song interface
const transformSongResponse = (apiSong: any): Song => ({
  id: apiSong.id || apiSong.trackId,
  title: apiSong.title,
  artist: apiSong.artist,
  language: apiSong.language,
  languageLabel: apiSong.languageLabel || getLanguageLabel(apiSong.language),
  difficulty: apiSong.difficulty || 'A1',
  albumArt: apiSong.albumArt || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop`,
  estimatedLearningTime: apiSong.estimatedLearningTime || 8,
  totalWords: apiSong.stats?.total_words || apiSong.totalWords || 0,
  uniqueWords: apiSong.stats?.unique_words || apiSong.uniqueWords || 0,
  slangWords: apiSong.slangWords || apiSong.stats?.slang_words?.map((s: any) => s.word) || [],
  wordFrequency: apiSong.wordFrequency || apiSong.word_frequency || {},
  lyrics: apiSong.lyrics || [],
});

const getLanguageLabel = (code: string): string => {
  const labels: Record<string, string> = {
    en: 'English', es: 'Spanish', fr: 'French', de: 'German',
    it: 'Italian', pt: 'Portuguese', ja: 'Japanese', ko: 'Korean',
    zh: 'Mandarin', ru: 'Russian', ar: 'Arabic', nl: 'Dutch',
  };
  return labels[code] || code;
};

// Search songs
export function useSearchSongs(query: string, language?: string, difficulty?: string) {
  return useQuery({
    queryKey: ['songs', 'search', query, language, difficulty],
    queryFn: async () => {
      const response = await songApi.search(query, language, difficulty);
      return response.songs?.map(transformSongResponse) || [];
    },
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

// Get single song with full lyrics and analysis
export function useSong(songId: string | undefined) {
  return useQuery({
    queryKey: ['songs', songId],
    queryFn: async () => {
      if (!songId) throw new Error('Song ID required');
      const response = await songApi.getById(songId);
      return transformSongResponse(response.song);
    },
    enabled: !!songId,
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  });
}

// Generate fill-blank challenge
export function useGenerateFillBlank(songId: string) {
  return useMutation({
    mutationFn: () => challengeApi.generateFillBlank(songId),
  });
}

// Generate multiple choice challenge
export function useGenerateMultipleChoice(songId: string) {
  return useMutation({
    mutationFn: () => challengeApi.generateMultipleChoice(songId),
  });
}

// Submit challenge attempt
export function useSubmitChallenge() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ challengeId, answers }: { challengeId: string; answers: string[] }) =>
      challengeApi.submitAttempt(challengeId, answers),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'progress'] });
    },
  });
}

// Get user progress from API
export function useUserProgress() {
  return useQuery({
    queryKey: ['user', 'progress'],
    queryFn: async () => {
      const response = await userApi.getProgress();
      return response.progress;
    },
    staleTime: 60 * 1000, // Cache for 1 minute
  });
}

// Mark word as learned
export function useMarkWordLearned() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ word, language, songId }: { word: string; language: string; songId?: string }) =>
      userApi.markWordLearned(word, language, songId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'progress'] });
      queryClient.invalidateQueries({ queryKey: ['words', 'learned'] });
    },
  });
}
