import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { useUser } from "@/context/UserContext";
import { ProgressCard } from "@/components/ProgressCard";
import { WeeklyChart } from "@/components/WeeklyChart";
import { AchievementBadge } from "@/components/AchievementBadge";
import { achievements } from "@/data/mockData";
import { BookOpen, Flame, Trophy, Target, TrendingUp } from "lucide-react";

const ProgressPage = () => {
  const { progress } = useUser();

  const levelProgress = (progress.totalPoints % 300) / 300 * 100;
  const pointsToNextLevel = 300 - (progress.totalPoints % 300);

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
            <TrendingUp className="w-8 h-8 text-primary" />
            My Progress
          </h1>
          <p className="text-muted-foreground">
            Track your learning journey
          </p>
        </motion.div>

        {/* Level Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-hero rounded-2xl p-6 text-primary-foreground"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-primary-foreground/80 mb-1">Current Level</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold">{progress.level}</span>
                <span className="text-xl">Intermediate Learner</span>
              </div>
            </div>
            <div className="flex-1 max-w-md">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Level {progress.level}</span>
                <span>Level {progress.level + 1}</span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
              <p className="text-sm text-primary-foreground/80 mt-2">
                {pointsToNextLevel} XP to next level
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ProgressCard
            title="Words Learned"
            value={progress.totalWordsLearned}
            icon={BookOpen}
            variant="primary"
            index={0}
          />
          <ProgressCard
            title="Current Streak"
            value={`${progress.currentStreak} days`}
            icon={Flame}
            variant="accent"
            index={1}
          />
          <ProgressCard
            title="Total Points"
            value={progress.totalPoints.toLocaleString()}
            icon={Trophy}
            variant="success"
            index={2}
          />
          <ProgressCard
            title="Challenges Done"
            value={12}
            icon={Target}
            variant="default"
            index={3}
          />
        </div>

        {/* Weekly Progress & Languages */}
        <div className="grid lg:grid-cols-2 gap-6">
          <WeeklyChart />
          
          <div className="bg-card rounded-xl p-5 shadow-card border border-border">
            <h3 className="font-semibold text-foreground mb-4">Languages Progress</h3>
            <div className="space-y-4">
              {Object.entries(progress.languages).map(([lang, words], index) => (
                <motion.div
                  key={lang}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{lang}</span>
                    <span className="text-sm text-muted-foreground">{words} words</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((words / 150) * 100, 100)}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="h-full gradient-primary rounded-full"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl p-6 shadow-card border border-border"
        >
          <h3 className="font-semibold text-foreground mb-4">Achievements</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {achievements.map((achievement, index) => (
              <AchievementBadge
                key={achievement.id}
                name={achievement.name}
                icon={achievement.icon}
                unlocked={achievement.unlocked}
                index={index}
              />
            ))}
          </div>
        </motion.div>

        {/* Vocabulary Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="bg-success/10 rounded-xl p-5 border border-success/20">
            <p className="text-3xl font-bold text-success">{progress.wordsKnown.length}</p>
            <p className="text-sm text-muted-foreground">Words I Know</p>
          </div>
          <div className="bg-warning/10 rounded-xl p-5 border border-warning/20">
            <p className="text-3xl font-bold text-warning">{progress.wordsLearning.length}</p>
            <p className="text-sm text-muted-foreground">Currently Learning</p>
          </div>
          <div className="bg-destructive/10 rounded-xl p-5 border border-destructive/20">
            <p className="text-3xl font-bold text-destructive">{progress.wordsToReview.length}</p>
            <p className="text-sm text-muted-foreground">To Review</p>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default ProgressPage;
