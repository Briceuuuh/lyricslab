import { motion } from "framer-motion";
import { Clock, Music2 } from "lucide-react";
import { difficultyColors } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SongCardProps {
  song: {
    id: string;
    title: string;
    artist: string;
    languageLabel: string;
    difficulty: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    albumArt: string;
    estimatedLearningTime: number;
  };
  onClick?: () => void;
  index?: number;
}

export function SongCard({ song, onClick, index = 0 }: SongCardProps) {
  const diffColor = difficultyColors[song.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className="group cursor-pointer bg-card rounded-xl shadow-card overflow-hidden border border-border hover:shadow-hover hover:border-primary/20 transition-all duration-300"
    >
      {/* Album Art */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={song.albumArt}
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center shadow-glow">
            <Music2 className="w-6 h-6 text-primary-foreground ml-1" />
          </div>
        </div>

        {/* Difficulty Badge */}
        <Badge 
          className={cn(
            "absolute top-3 right-3 font-semibold",
            diffColor.bg,
            diffColor.text,
            "border-0"
          )}
        >
          {song.difficulty}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {song.title}
        </h3>
        <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
        
        <div className="flex items-center justify-between pt-2">
          <Badge variant="secondary" className="text-xs">
            {song.languageLabel}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {song.estimatedLearningTime} min
          </span>
        </div>
      </div>
    </motion.div>
  );
}
