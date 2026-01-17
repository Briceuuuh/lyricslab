import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";

export function WeeklyChart() {
  const { progress } = useUser();
  const maxWords = Math.max(...progress.weeklyProgress.map(d => d.words), 1);

  return (
    <div className="bg-card rounded-xl p-5 shadow-card border border-border">
      <h3 className="font-semibold text-foreground mb-4">This Week</h3>
      
      <div className="flex items-end justify-between gap-2 h-32">
        {progress.weeklyProgress.map((day, index) => {
          const height = (day.words / maxWords) * 100;
          const isToday = index === progress.weeklyProgress.length - 1;
          
          return (
            <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height, 4)}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-full rounded-t-md ${
                  isToday 
                    ? "gradient-primary" 
                    : day.words > 0 
                      ? "bg-primary/40" 
                      : "bg-muted"
                }`}
              />
              <span className={`text-xs ${isToday ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                {day.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div>
          <p className="text-2xl font-bold text-foreground">
            {progress.weeklyProgress.reduce((sum, d) => sum + d.words, 0)}
          </p>
          <p className="text-xs text-muted-foreground">words this week</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">
            +{progress.weeklyProgress.reduce((sum, d) => sum + d.points, 0)}
          </p>
          <p className="text-xs text-muted-foreground">points earned</p>
        </div>
      </div>
    </div>
  );
}
