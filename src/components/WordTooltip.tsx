import { motion } from "framer-motion";
import { Word } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Check, BookOpen } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface WordTooltipProps {
  word: Word;
  onClose: () => void;
}

const typeColors = {
  common: "border-l-success",
  slang: "border-l-accent",
  advanced: "border-l-primary",
  argot: "border-l-destructive",
};

const typeBadge = {
  common: { bg: "bg-success/20", text: "text-success" },
  slang: { bg: "bg-accent/20", text: "text-accent" },
  advanced: { bg: "bg-primary/20", text: "text-primary" },
  argot: { bg: "bg-destructive/20", text: "text-destructive" },
};

export function WordTooltip({ word, onClose }: WordTooltipProps) {
  const { progress, addWordLearned } = useUser();
  
  const isKnown = progress.wordsKnown.includes(word.text);
  const isLearning = progress.wordsLearning.includes(word.text);

  const handleAddWord = (category: 'known' | 'learning') => {
    addWordLearned(word.text, category);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className={cn(
        "absolute z-50 bg-card rounded-xl shadow-hover border border-border p-4 min-w-[280px] border-l-4",
        typeColors[word.type]
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-lg text-foreground">{word.text}</h4>
          <p className="text-primary font-medium">{word.translation}</p>
        </div>
        <span className={cn(
          "px-2 py-0.5 rounded-full text-xs font-medium uppercase",
          typeBadge[word.type].bg,
          typeBadge[word.type].text
        )}>
          {word.type}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-sm text-muted-foreground">{word.definition}</p>
        <p className="text-xs text-muted-foreground">
          <span className="font-medium">{word.partOfSpeech}</span>
          {word.frequency > 1 && (
            <span className="ml-2">• Appears {word.frequency}× in this song</span>
          )}
        </p>
      </div>

      <div className="flex gap-2">
        {isKnown ? (
          <Button disabled size="sm" className="flex-1 bg-success/20 text-success border-0">
            <Check className="w-4 h-4 mr-1" />
            Known
          </Button>
        ) : (
          <Button 
            size="sm" 
            className="flex-1 gradient-success text-success-foreground border-0"
            onClick={() => handleAddWord('known')}
          >
            <Check className="w-4 h-4 mr-1" />
            I Know This
          </Button>
        )}
        
        {!isKnown && !isLearning && (
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1"
            onClick={() => handleAddWord('learning')}
          >
            <BookOpen className="w-4 h-4 mr-1" />
            Learn
          </Button>
        )}
        
        {isLearning && (
          <Button disabled size="sm" variant="outline" className="flex-1">
            <BookOpen className="w-4 h-4 mr-1" />
            Learning
          </Button>
        )}
      </div>
    </motion.div>
  );
}
