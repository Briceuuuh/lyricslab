import { useQuery } from '@tanstack/react-query';
import { searchApi, songApi, convertApiSongToSong, convertApiArtistToArtist, Song, Artist } from '@/services/api';
import { mockSongs } from '@/data/mockData';

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
 * Uses real API (/search/songs) and falls back to mock data if unavailable
 */
export function useSongsSearch({ query, language, difficulty, enabled = true }: UseSongsSearchParams = {}) {
  return useQuery({
    queryKey: songKeys.search({ q: query, language, difficulty }),
    queryFn: async () => {
      // If no query, return mock data for browsing
      if (!query || query.trim() === '') {
        console.log('[useSongsSearch] No query, using mock data for browsing');
        return mockSongs.filter((song) => {
          const matchesLanguage = !language || song.language === language;
          const matchesDifficulty = !difficulty || song.difficulty === difficulty;
          return matchesLanguage && matchesDifficulty;
        });
      }

      try {
        const result = await searchApi.searchSongs(query);
        
        if (result.success && result.results.length > 0) {
          // Convert API songs to app format with full metadata
          let songs = result.results.map(convertApiSongToSong);
          
          // Filter only songs that have lyrics available
          songs = songs.filter(s => s.hasLyrics !== false);
          
          // Apply local filters
          if (language) {
            songs = songs.filter(s => s.language === language);
          }
          if (difficulty) {
            songs = songs.filter(s => s.difficulty === difficulty);
          }
          
          console.log(`[useSongsSearch] Found ${songs.length} songs with API`);
          return songs;
        }
        
        // If no results, fall back to mock data
        console.warn('[useSongsSearch] No results from API, using mock data');
        return mockSongs.filter((song) => {
          const matchesQuery = !query ||
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase());
          const matchesLanguage = !language || song.language === language;
          const matchesDifficulty = !difficulty || song.difficulty === difficulty;
          return matchesQuery && matchesLanguage && matchesDifficulty;
        });
      } catch (error) {
        console.warn('[useSongsSearch] API unavailable, using mock data:', error);
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
        return mockSongs
          .filter((s) => !language || s.language === language)
          .slice(0, 10);
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export interface SearchAllResult {
  artists: Artist[];
  songs: Song[];
}

/**
 * Hook to search all (songs + artists)
 * Uses the /search endpoint with full metadata
 */
export function useSearchAll(query: string, enabled = true) {
  return useQuery({
    queryKey: ['search', 'all', query],
    queryFn: async (): Promise<SearchAllResult> => {
      if (!query || query.trim() === '') {
        return { artists: [], songs: [] };
      }
      
      try {
        const result = await searchApi.searchAll(query);
        
        // Convert with full metadata
        const artists = result.artists.results.map(convertApiArtistToArtist);
        const songs = result.songs.results.map(convertApiSongToSong);
        
        console.log(`[useSearchAll] Found ${artists.length} artists, ${songs.length} songs`);
        
        return { artists, songs };
      } catch (error) {
        console.warn('[useSearchAll] API unavailable:', error);
        return { artists: [], songs: [] };
      }
    },
    enabled: enabled && !!query,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to search artists only
 */
export function useArtistsSearch(query: string, enabled = true) {
  return useQuery({
    queryKey: ['search', 'artists', query],
    queryFn: async (): Promise<Artist[]> => {
      if (!query || query.trim() === '') {
        return [];
      }
      
      try {
        const result = await searchApi.searchArtists(query);
        return result.results.map(convertApiArtistToArtist);
      } catch (error) {
        console.warn('[useArtistsSearch] API unavailable:', error);
        return [];
      }
    },
    enabled: enabled && !!query,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}
