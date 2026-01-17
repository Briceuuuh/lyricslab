import { useState } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { ChallengeCard } from "@/components/ChallengeCard";
import { FillBlankChallenge } from "@/components/FillBlankChallenge";
import { MultipleChoiceChallenge } from "@/components/MultipleChoiceChallenge";
import { mockChallenges, Challenge } from "@/data/mockData";
import { Target, Trophy, Flame } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const ChallengesPage = () => {
  const { progress } = useUser();
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [lastResult, setLastResult] = useState<{ score: number; correct: number } | null>(null);

  const handleStartChallenge = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setLastResult(null);
  };

  const handleChallengeComplete = (score: number, correct: number) => {
    setLastResult({ score, correct });
  };

  const handleCloseChallenge = () => {
    setActiveChallenge(null);
    setLastResult(null);
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Challenges
          </h1>
          <p className="text-muted-foreground">
            Test your knowledge and earn points!
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-xl p-5 shadow-card border border-border text-center"
          >
            <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{progress.totalPoints}</p>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl p-5 shadow-card border border-border text-center"
          >
            <Flame className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{progress.currentStreak}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl p-5 shadow-card border border-border text-center"
          >
            <Target className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{mockChallenges.length}</p>
            <p className="text-sm text-muted-foreground">Available</p>
          </motion.div>
        </div>

        {/* Challenge Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Available Challenges</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {mockChallenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                index={index}
                onClick={() => handleStartChallenge(challenge)}
              />
            ))}
          </div>
        </div>

        {/* Challenge Dialog */}
        <Dialog open={!!activeChallenge} onOpenChange={(open) => !open && handleCloseChallenge()}>
          <DialogContent className="max-w-lg p-0 gap-0 bg-transparent border-0 shadow-none">
            {activeChallenge && activeChallenge.type === 'fill_blank' && (
              <FillBlankChallenge
                challenge={activeChallenge}
                onComplete={handleChallengeComplete}
                onClose={handleCloseChallenge}
              />
            )}
            {activeChallenge && activeChallenge.type === 'multiple_choice' && (
              <MultipleChoiceChallenge
                challenge={activeChallenge}
                onComplete={handleChallengeComplete}
                onClose={handleCloseChallenge}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default ChallengesPage;
