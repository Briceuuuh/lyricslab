import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { mockUserProgress, UserProgress } from '@/data/mockData';

interface UserContextType {
  progress: UserProgress;
  updateProgress: (updates: Partial<UserProgress>) => void;
  addWordLearned: (word: string, category: 'known' | 'learning' | 'review') => void;
  removeWord: (word: string) => void;
  moveWord: (word: string, from: 'known' | 'learning' | 'review', to: 'known' | 'learning' | 'review') => void;
  addPoints: (points: number) => void;
  incrementStreak: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useLocalStorage<UserProgress>('lyriclab_progress', mockUserProgress);
  const [selectedLanguage, setSelectedLanguage] = useLocalStorage<string>('lyriclab_language', 'es');

  const updateProgress = (updates: Partial<UserProgress>) => {
    setProgress(prev => ({ ...prev, ...updates }));
  };

  const addWordLearned = (word: string, category: 'known' | 'learning' | 'review') => {
    setProgress(prev => {
      const categoryKey = category === 'known' ? 'wordsKnown' : category === 'learning' ? 'wordsLearning' : 'wordsToReview';
      if (prev[categoryKey].includes(word)) return prev;
      
      return {
        ...prev,
        [categoryKey]: [...prev[categoryKey], word],
        totalWordsLearned: category === 'known' ? prev.totalWordsLearned + 1 : prev.totalWordsLearned,
      };
    });
  };

  const removeWord = (word: string) => {
    setProgress(prev => ({
      ...prev,
      wordsKnown: prev.wordsKnown.filter(w => w !== word),
      wordsLearning: prev.wordsLearning.filter(w => w !== word),
      wordsToReview: prev.wordsToReview.filter(w => w !== word),
    }));
  };

  const moveWord = (word: string, from: 'known' | 'learning' | 'review', to: 'known' | 'learning' | 'review') => {
    const fromKey = from === 'known' ? 'wordsKnown' : from === 'learning' ? 'wordsLearning' : 'wordsToReview';
    const toKey = to === 'known' ? 'wordsKnown' : to === 'learning' ? 'wordsLearning' : 'wordsToReview';
    
    setProgress(prev => ({
      ...prev,
      [fromKey]: prev[fromKey].filter(w => w !== word),
      [toKey]: [...prev[toKey], word],
    }));
  };

  const addPoints = (points: number) => {
    setProgress(prev => {
      const newPoints = prev.totalPoints + points;
      const newLevel = Math.floor(newPoints / 300) + 1;
      return {
        ...prev,
        totalPoints: newPoints,
        level: Math.max(prev.level, newLevel),
      };
    });
  };

  const incrementStreak = () => {
    setProgress(prev => ({
      ...prev,
      currentStreak: prev.currentStreak + 1,
    }));
  };

  return (
    <UserContext.Provider value={{
      progress,
      updateProgress,
      addWordLearned,
      removeWord,
      moveWord,
      addPoints,
      incrementStreak,
      selectedLanguage,
      setSelectedLanguage,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
