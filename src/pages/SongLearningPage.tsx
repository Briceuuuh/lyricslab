import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { WordTooltip } from "@/components/WordTooltip";
import { mockSongs, difficultyColors, Word } from "@/data/mockData";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  Play, 
  Bookmark, 
  Clock, 
  BookOpen, 
  Target,
  Info,
  ChevronRight,
  Loader2
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSong } from "@/hooks/useApi";

const SongLearningPage = () => {
  const { songId } = useParams();
  const navigate = useNavigate();
  const { progress } = useUser();
  const [selectedWord, setSelectedWord] = useState<{ word: Word; position: { x: number; y: number } } | null>(null);
  const [saved, setSaved] = useState(false);

  // Try to fetch from API first
  const { data: apiSong, isLoading, isError } = useSong(songId);
  
  // Fall back to mock data if API fails or is loading
  const mockSong = useMemo(() => mockSongs.find(s => s.id === songId), [songId]);
  const song = apiSong || mockSong;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading song...</p>
        </div>
      </MainLayout>
    );
  }

  if (!song) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold text-foreground mb-4">Song not found</h2>
          <Button onClick={() => navigate("/browse")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </Button>
        </div>
      </MainLayout>
    );
  }

  const diffColor = difficultyColors[song.difficulty];
  const learnedWordsInSong = song.lyrics.flatMap(line => 
    line.words.filter(w => progress.wordsKnown.includes(w.text))
  ).length;
  const totalWordsInSong = song.lyrics.reduce((sum, line) => sum + line.words.length, 0);

  const handleWordClick = (word: Word, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setSelectedWord({
      word,
      position: { x: rect.left, y: rect.bottom + 8 }
    });
  };

  const getWordStatus = (word: Word) => {
    if (progress.wordsKnown.includes(word.text)) return "known";
    if (progress.wordsLearning.includes(word.text)) return "learning";
    if (progress.wordsToReview.includes(word.text)) return "review";
    return "new";
  };

  const wordStatusStyles = {
    known: "bg-success/20 text-success border-success/30",
    learning: "bg-warning/20 text-warning border-warning/30",
    review: "bg-destructive/20 text-destructive border-destructive/30",
    new: "bg-muted hover:bg-primary/10 hover:text-primary border-transparent",
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6" onClick={() => setSelectedWord(null)}>
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button variant="ghost" onClick={() => navigate(-1)} className="text-muted-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </motion.div>

        {/* Song Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl shadow-card border border-border overflow-hidden"
        >
          <div className="flex flex-col md:flex-row">
            {/* Album Art */}
            <div className="md:w-64 aspect-square md:aspect-auto relative">
              <img
                src={song.albumArt}
                alt={song.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-card via-transparent to-transparent" />
            </div>

            {/* Song Info */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={cn(diffColor.bg, diffColor.text, "border-0")}>
                    {song.difficulty}
                  </Badge>
                  <Badge variant="secondary">{song.languageLabel}</Badge>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {song.title}
                </h1>
                <p className="text-lg text-muted-foreground">{song.artist}</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{song.estimatedLearningTime} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span>{learnedWordsInSong}/{totalWordsInSong} words learned</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button className="gradient-primary text-primary-foreground border-0">
                  <Play className="w-4 h-4 mr-2" />
                  Start Learning
                </Button>
                <Button 
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
                  className={cn(saved && "bg-primary/10 border-primary text-primary")}
                >
                  <Bookmark className={cn("w-4 h-4 mr-2", saved && "fill-current")} />
                  {saved ? "Saved" : "Save"}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate(`/challenges?songId=${song.id}`)}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Challenge
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-4 px-4"
        >
          <span className="text-sm font-medium text-muted-foreground">Word status:</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-success" />
            <span className="text-sm text-muted-foreground">Known</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-sm text-muted-foreground">Learning</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-destructive" />
            <span className="text-sm text-muted-foreground">To Review</span>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Click on any word to see its definition and add it to your vocabulary</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>

        {/* Lyrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl shadow-card border border-border p-6 space-y-6"
        >
          {song.lyrics.map((line, lineIndex) => (
            <motion.div
              key={lineIndex}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + lineIndex * 0.1 }}
              className="group"
            >
              <div className="flex flex-wrap gap-2 mb-2">
                {line.words.map((word, wordIndex) => {
                  const status = getWordStatus(word);
                  
                  return (
                    <button
                      key={`${lineIndex}-${wordIndex}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWordClick(word, e);
                      }}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200",
                        wordStatusStyles[status],
                        "hover:scale-105"
                      )}
                    >
                      {word.text}
                      {word.type !== 'common' && (
                        <span className={cn(
                          "ml-1 text-[10px] uppercase",
                          word.type === 'slang' && "text-accent",
                          word.type === 'advanced' && "text-primary",
                          word.type === 'argot' && "text-destructive"
                        )}>
                          {word.type}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-muted-foreground text-sm pl-1 flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-3 h-3" />
                {line.translation}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Word Tooltip */}
        <AnimatePresence>
          {selectedWord && (
            <div
              style={{
                position: 'fixed',
                left: Math.min(selectedWord.position.x, window.innerWidth - 300),
                top: selectedWord.position.y,
                zIndex: 100,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <WordTooltip
                word={selectedWord.word}
                onClose={() => setSelectedWord(null)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default SongLearningPage;
