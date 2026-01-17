import { motion } from "framer-motion";
import { Target, Brain, Pencil, Trophy } from "lucide-react";
import { Challenge } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChallengeCardProps {
  challenge: Challenge;
  onClick?: () => void;
  index?: number;
}

const typeIcons = {
  fill_blank: Pencil,
  multiple_choice: Brain,
  word_association: Target,
};

const typeLabels = {
  fill_blank: "Fill the Blank",
  multiple_choice: "Multiple Choice",
  word_association: "Word Association",
};

const typeColors = {
  fill_blank: "gradient-primary",
  multiple_choice: "gradient-accent",
  word_association: "gradient-success",
};

export function ChallengeCard({ challenge, onClick, index = 0 }: ChallengeCardProps) {
  const Icon = typeIcons[challenge.type];
  const totalPoints = challenge.questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-card rounded-xl shadow-card border border-border overflow-hidden hover:shadow-hover hover:border-primary/20 transition-all duration-300"
    >
      {/* Header */}
      <div className={cn("p-4", typeColors[challenge.type])}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-semibold">{typeLabels[challenge.type]}</p>
            <p className="text-white/80 text-sm">{challenge.questions.length} questions</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        <div>
          <h4 className="font-semibold text-foreground">{challenge.songTitle}</h4>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">{totalPoints} pts</span>
          </div>
          <Button onClick={onClick} size="sm" className="gradient-primary text-primary-foreground border-0">
            Start Challenge
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
