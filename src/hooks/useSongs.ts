import { useQuery } from '@tanstack/react-query';
import { songApi } from '@/services/api';
import { mockSongs, Song } from '@/data/mockData';

// Query keys for cache management
export const songKeys = {
  all: ['songs'] as const,
  search: (params: { q?: string; language?: string; difficulty?: string }) =>
    [...songKeys.all, 'search', params] as const,
  detail: (id: string) => [...songKeys.all, 'detail', id] as const,
  popular: (language?: string) => [...songKeys.all, 'popular', language] as const,
};

interface UseSongsSearchParams {
  query?: string;
  language?: string;
  difficulty?: string;
  enabled?: boolean;
}

/**
 * Hook to search for songs
 * Falls back to mock data if API is unavailable
 */
export function useSongsSearch({ query, language, difficulty, enabled = true }: UseSongsSearchParams = {}) {
  return useQuery({
    queryKey: songKeys.search({ q: query, language, difficulty }),
    queryFn: async () => {
      try {
        const result = await songApi.search({ q: query, language, difficulty });
        return result.songs;
      } catch (error) {
        console.warn('[useSongsSearch] API unavailable, using mock data:', error);
        // Fallback to mock data
        return mockSongs.filter((song) => {
          const matchesQuery = !query ||
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase());
          const matchesLanguage = !language || song.language === language;
          const matchesDifficulty = !difficulty || song.difficulty === difficulty;
          return matchesQuery && matchesLanguage && matchesDifficulty;
        });
      }
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to get a single song by ID
 * Falls back to mock data if API is unavailable
 */
export function useSong(songId: string | undefined) {
  return useQuery({
    queryKey: songKeys.detail(songId || ''),
    queryFn: async () => {
      if (!songId) throw new Error('Song ID is required');
      
      try {
        const result = await songApi.getById(songId);
        return result.song;
      } catch (error) {
        console.warn('[useSong] API unavailable, using mock data:', error);
        // Fallback to mock data
        const song = mockSongs.find((s) => s.id === songId);
        if (!song) throw new Error('Song not found');
        return song;
      }
    },
    enabled: !!songId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
  });
}

/**
 * Hook to get popular songs
 * Falls back to mock data if API is unavailable
 */
export function usePopularSongs(language?: string) {
  return useQuery({
    queryKey: songKeys.popular(language),
    queryFn: async () => {
      try {
        const result = await songApi.getPopular(language);
        return result.songs;
      } catch (error) {
        console.warn('[usePopularSongs] API unavailable, using mock data:', error);
        // Fallback to mock data
        return mockSongs
          .filter((s) => !language || s.language === language)
          .slice(0, 10);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
