import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Challenge } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Check, X, Trophy, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

interface MultipleChoiceChallengeProps {
  challenge: Challenge;
  onComplete: (score: number, correct: number) => void;
  onClose: () => void;
}

export function MultipleChoiceChallenge({ challenge, onComplete, onClose }: MultipleChoiceChallengeProps) {
  const { addPoints } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = challenge.questions[currentIndex];
  const progress = ((currentIndex + 1) / challenge.questions.length) * 100;

  const handleSelect = (option: string) => {
    if (showResult) return;
    
    setSelectedAnswer(option);
    setShowResult(true);

    const isCorrect = option === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + currentQuestion.points);
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIndex < challenge.questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const finalScore = score + (isCorrect ? currentQuestion.points : 0);
        setIsComplete(true);
        addPoints(finalScore);
        onComplete(finalScore, correctCount + (isCorrect ? 1 : 0));
      }
    }, 1500);
  };

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl shadow-hover p-8 max-w-md mx-auto text-center"
      >
        <div className="w-20 h-20 rounded-full gradient-success mx-auto flex items-center justify-center mb-6">
          <Trophy className="w-10 h-10 text-success-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Challenge Complete!</h2>
        <p className="text-muted-foreground mb-6">{challenge.songTitle}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted rounded-xl p-4">
            <p className="text-3xl font-bold text-primary">{score}</p>
            <p className="text-sm text-muted-foreground">Points Earned</p>
          </div>
          <div className="bg-muted rounded-xl p-4">
            <p className="text-3xl font-bold text-success">{correctCount}/{challenge.questions.length}</p>
            <p className="text-sm text-muted-foreground">Correct</p>
          </div>
        </div>

        <Button onClick={onClose} className="w-full gradient-primary text-primary-foreground border-0">
          Continue
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="bg-card rounded-2xl shadow-hover overflow-hidden max-w-lg mx-auto">
      {/* Header */}
      <div className="gradient-accent p-4">
        <div className="flex items-center justify-between text-accent-foreground mb-3">
          <span className="text-sm font-medium">{challenge.songTitle}</span>
          <span className="text-sm">
            {currentIndex + 1}/{challenge.questions.length}
          </span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-white rounded-full"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-accent" />
          <span className="font-semibold text-foreground">{score} pts</span>
        </div>
        {streak >= 2 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1"
          >
            <Flame className="w-4 h-4 text-accent animate-streak-fire" />
            <span className="text-sm font-medium text-accent">{streak} streak!</span>
          </motion.div>
        )}
      </div>

      {/* Question */}
      <div className="p-6 space-y-6">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Translate this line:</p>
          <p className="text-lg text-foreground font-medium leading-relaxed">
            "{currentQuestion.lyricLine}"
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {currentQuestion.options?.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correctAnswer;
            const showCorrect = showResult && isCorrect;
            const showWrong = showResult && isSelected && !isCorrect;

            return (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleSelect(option)}
                disabled={showResult}
                className={cn(
                  "w-full p-4 rounded-xl text-left transition-all duration-200 flex items-center justify-between border-2",
                  !showResult && "hover:bg-muted hover:border-primary",
                  !showResult && !isSelected && "bg-background border-border",
                  showCorrect && "bg-success/20 border-success",
                  showWrong && "bg-destructive/20 border-destructive",
                  isSelected && !showResult && "border-primary bg-primary/10"
                )}
              >
                <span className={cn(
                  "font-medium",
                  showCorrect && "text-success",
                  showWrong && "text-destructive",
                  !showResult && "text-foreground"
                )}>
                  {option}
                </span>
                
                <AnimatePresence>
                  {showCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-success flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-success-foreground" />
                    </motion.div>
                  )}
                  {showWrong && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 rounded-full bg-destructive flex items-center justify-center"
                    >
                      <X className="w-4 h-4 text-destructive-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
