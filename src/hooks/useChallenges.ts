import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { challengeApi, Challenge, ChallengeQuestion, ChallengeAttemptResult } from '@/services/api';
import { mockChallenges } from '@/data/mockData';
import { useUser } from '@/context/UserContext';

// Query keys for cache management
export const challengeKeys = {
  all: ['challenges'] as const,
  list: () => [...challengeKeys.all, 'list'] as const,
  bySong: (songId: string) => [...challengeKeys.all, 'song', songId] as const,
  generated: (songId: string, type: string) => [...challengeKeys.all, 'generated', songId, type] as const,
};

/**
 * Hook to get all available challenges
 * Falls back to mock data if API is unavailable
 */
export function useChallenges() {
  return useQuery({
    queryKey: challengeKeys.list(),
    queryFn: async () => {
      try {
        const result = await challengeApi.getAll();
        return result.challenges;
      } catch (error) {
        console.warn('[useChallenges] API unavailable, using mock data:', error);
        return mockChallenges;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to get challenges for a specific song
 */
export function useSongChallenges(songId: string | undefined) {
  return useQuery({
    queryKey: challengeKeys.bySong(songId || ''),
    queryFn: async () => {
      if (!songId) throw new Error('Song ID is required');
      
      try {
        const result = await challengeApi.getBySong(songId);
        return result.challenges;
      } catch (error) {
        console.warn('[useSongChallenges] API unavailable, using mock data:', error);
        return mockChallenges.filter((c) => c.songId === songId);
      }
    },
    enabled: !!songId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to generate a fill-the-blank challenge
 */
export function useGenerateFillBlank() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ songId, numBlanks = 5 }: { songId: string; numBlanks?: number }) => {
      const result = await challengeApi.generateFillBlank(songId, numBlanks);
      return result.challenges;
    },
    onSuccess: (data, variables) => {
      // Cache the generated challenge
      queryClient.setQueryData(
        challengeKeys.generated(variables.songId, 'fill_blank'),
        data
      );
    },
  });
}

/**
 * Hook to generate a multiple choice challenge
 */
export function useGenerateMultipleChoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ songId, numQuestions = 5 }: { songId: string; numQuestions?: number }) => {
      const result = await challengeApi.generateMultipleChoice(songId, numQuestions);
      return result.questions;
    },
    onSuccess: (data, variables) => {
      // Cache the generated challenge
      queryClient.setQueryData(
        challengeKeys.generated(variables.songId, 'multiple_choice'),
        data
      );
    },
  });
}

/**
 * Hook to submit a challenge attempt
 */
export function useSubmitChallengeAttempt() {
  const { addPoints } = useUser();

  return useMutation({
    mutationFn: async ({ challengeId, answers }: { challengeId: string; answers: string[] }) => {
      try {
        const result = await challengeApi.submitAttempt(challengeId, answers);
        return result;
      } catch (error) {
        console.warn('[useSubmitChallengeAttempt] API unavailable, calculating locally:', error);
        // Fallback to local scoring
        const challenge = mockChallenges.find((c) => c.id === challengeId);
        if (!challenge) throw new Error('Challenge not found');

        let correct = 0;
        const feedback: ChallengeAttemptResult['feedback'] = [];

        answers.forEach((answer, index) => {
          const question = challenge.questions[index];
          if (question && answer.toLowerCase() === question.correctAnswer.toLowerCase()) {
            correct++;
            feedback.push({ index, correct: true });
          } else {
            feedback.push({ index, correct: false, expected: question?.correctAnswer });
          }
        });

        const score = (correct / answers.length) * 100;
        const points = Math.round((correct / answers.length) * 50);

        return {
          success: true,
          score,
          correct,
          total: answers.length,
          points,
          feedback,
        } as ChallengeAttemptResult;
      }
    },
    onSuccess: (result) => {
      // Add points to user progress
      if (result.points > 0) {
        addPoints(result.points);
      }
    },
  });
}

/**
 * Hook to get a generated challenge (from cache)
 */
export function useGeneratedChallenge(songId: string, type: 'fill_blank' | 'multiple_choice') {
  return useQuery({
    queryKey: challengeKeys.generated(songId, type),
    queryFn: () => [] as ChallengeQuestion[],
    enabled: false, // Only read from cache
    staleTime: Infinity,
  });
}
