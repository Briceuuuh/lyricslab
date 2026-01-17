import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface AchievementBadgeProps {
  name: string;
  icon: string;
  unlocked: boolean;
  index?: number;
}

export function AchievementBadge({ name, icon, unlocked, index = 0 }: AchievementBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200",
        unlocked 
          ? "bg-primary/10 hover:bg-primary/20" 
          : "bg-muted opacity-60"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
        unlocked ? "gradient-primary" : "bg-muted-foreground/20"
      )}>
        {unlocked ? (
          <span>{icon}</span>
        ) : (
          <Lock className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      <p className={cn(
        "text-xs text-center font-medium",
        unlocked ? "text-foreground" : "text-muted-foreground"
      )}>
        {name}
      </p>
    </motion.div>
  );
}
