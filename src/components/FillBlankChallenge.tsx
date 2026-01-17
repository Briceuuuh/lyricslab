import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Challenge, ChallengeQuestion } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Eye, SkipForward, Trophy, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUser } from "@/context/UserContext";

interface FillBlankChallengeProps {
  challenge: Challenge;
  onComplete: (score: number, correct: number) => void;
  onClose: () => void;
}

export function FillBlankChallenge({ challenge, onComplete, onClose }: FillBlankChallengeProps) {
  const { addPoints } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentQuestion = challenge.questions[currentIndex];
  const progress = ((currentIndex + 1) / challenge.questions.length) * 100;

  const handleSubmit = () => {
    if (!answer.trim()) return;

    const isCorrect = answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase();
    
    if (isCorrect) {
      const points = revealed ? Math.floor(currentQuestion.points / 2) : currentQuestion.points;
      setScore(prev => prev + points);
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
      setShowResult("correct");
    } else {
      setStreak(0);
      setShowResult("wrong");
    }

    setTimeout(() => {
      if (currentIndex < challenge.questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setAnswer("");
        setRevealed(false);
        setShowResult(null);
      } else {
        const finalScore = score + (answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase() 
          ? (revealed ? Math.floor(currentQuestion.points / 2) : currentQuestion.points)
          : 0);
        setIsComplete(true);
        addPoints(finalScore);
        onComplete(finalScore, correctCount + (answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase() ? 1 : 0));
      }
    }, 1500);
  };

  const handleReveal = () => {
    setRevealed(true);
  };

  const handleSkip = () => {
    setStreak(0);
    if (currentIndex < challenge.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setAnswer("");
      setRevealed(false);
      setShowResult(null);
    } else {
      setIsComplete(true);
      addPoints(score);
      onComplete(score, correctCount);
    }
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

  // Get the lyric line with the blank
  const lyricWithBlank = currentQuestion.lyricLine;

  return (
    <div className="bg-card rounded-2xl shadow-hover overflow-hidden max-w-lg mx-auto">
      {/* Header */}
      <div className="gradient-primary p-4">
        <div className="flex items-center justify-between text-primary-foreground mb-3">
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
          <p className="text-lg text-foreground font-medium leading-relaxed">
            {lyricWithBlank}
          </p>
          {revealed && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-success font-medium mt-2"
            >
              Answer: {currentQuestion.correctAnswer}
            </motion.p>
          )}
        </div>

        {/* Input */}
        <div className="relative">
          <Input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type the missing word..."
            className="text-center text-lg h-14 bg-muted/50 border-2 border-border focus:border-primary"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={showResult !== null}
          />
          
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center",
                  showResult === "correct" ? "bg-success" : "bg-destructive"
                )}
              >
                {showResult === "correct" ? (
                  <Check className="w-5 h-5 text-success-foreground" />
                ) : (
                  <X className="w-5 h-5 text-destructive-foreground" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleReveal}
            disabled={revealed || showResult !== null}
            className="flex-1"
          >
            <Eye className="w-4 h-4 mr-2" />
            Reveal
          </Button>
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={showResult !== null}
            className="flex-1"
          >
            <SkipForward className="w-4 h-4 mr-2" />
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!answer.trim() || showResult !== null}
            className="flex-1 gradient-primary text-primary-foreground border-0"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
