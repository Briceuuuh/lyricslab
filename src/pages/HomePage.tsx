import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { SongCard } from "@/components/SongCard";
import { ProgressCard } from "@/components/ProgressCard";
import { WeeklyChart } from "@/components/WeeklyChart";
import { AchievementBadge } from "@/components/AchievementBadge";
import { ChallengeCard } from "@/components/ChallengeCard";
import { useUser } from "@/context/UserContext";
import { achievements } from "@/data/mockData";
import { BookOpen, Flame, Trophy, Target, ArrowRight, Music, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePopularSongs } from "@/hooks/useSongs";
import { useChallenges } from "@/hooks/useChallenges";
import { useDebounce } from "@/hooks/useDebounce";

const HomePage = () => {
  const navigate = useNavigate();
  const { progress, selectedLanguage } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Fetch popular songs for selected language
  const { data: allSongs = [], isLoading: songsLoading } = usePopularSongs(selectedLanguage);

  // Fetch challenges
  const { data: allChallenges = [], isLoading: challengesLoading } = useChallenges();

  // Filter songs by search query
  const filteredSongs = allSongs.filter(song => {
    const matchesSearch = debouncedQuery === "" || 
      song.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(debouncedQuery.toLowerCase());
    return matchesSearch;
  });

  const recommendedSongs = filteredSongs.slice(0, 4);
  const recentChallenges = allChallenges.slice(0, 2);

  return (
    <MainLayout onSearch={setSearchQuery}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to learn some new words through music?
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <ProgressCard
            title="Words Learned"
            value={progress.totalWordsLearned}
            subtitle="Total vocabulary"
            icon={BookOpen}
            variant="primary"
            index={0}
          />
          <ProgressCard
            title="Current Streak"
            value={`${progress.currentStreak} days`}
            subtitle="Keep it up!"
            icon={Flame}
            variant="accent"
            index={1}
          />
          <ProgressCard
            title="Total Points"
            value={progress.totalPoints.toLocaleString()}
            subtitle={`Level ${progress.level}`}
            icon={Trophy}
            variant="success"
            index={2}
          />
          <ProgressCard
            title="Challenges"
            value={allChallenges.length}
            subtitle="Available"
            icon={Target}
            variant="default"
            index={3}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Songs & Challenges */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recommended Songs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Music className="w-5 h-5 text-primary" />
                  Recommended for You
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/browse")}
                  className="text-primary hover:text-primary"
                >
                  See All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {songsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <span className="ml-2 text-muted-foreground">Loading songs...</span>
                </div>
              ) : recommendedSongs.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {recommendedSongs.map((song, index) => (
                    <SongCard
                      key={song.id}
                      song={song}
                      index={index}
                      onClick={() => navigate(`/song/${song.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-muted rounded-xl p-8 text-center">
                  <Music className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No songs found for this language. Try changing your language filter!
                  </p>
                </div>
              )}
            </div>

            {/* Active Challenges */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Ready to Challenge?
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate("/challenges")}
                  className="text-primary hover:text-primary"
                >
                  All Challenges
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {challengesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {recentChallenges.map((challenge, index) => (
                    <ChallengeCard
                      key={challenge.id}
                      challenge={challenge}
                      index={index}
                      onClick={() => navigate(`/challenges?id=${challenge.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Progress & Achievements */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <WeeklyChart />

            {/* Languages Progress */}
            <div className="bg-card rounded-xl p-5 shadow-card border border-border">
              <h3 className="font-semibold text-foreground mb-4">Your Languages</h3>
              <div className="space-y-3">
                {Object.entries(progress.languages).map(([lang, words]) => (
                  <div key={lang} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">{lang}</span>
                      <span className="text-muted-foreground">{words} words</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((words / 150) * 100, 100)}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full gradient-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-card rounded-xl p-5 shadow-card border border-border">
              <h3 className="font-semibold text-foreground mb-4">Achievements</h3>
              <div className="grid grid-cols-3 gap-2">
                {achievements.slice(0, 6).map((achievement, index) => (
                  <AchievementBadge
                    key={achievement.id}
                    name={achievement.name}
                    icon={achievement.icon}
                    unlocked={achievement.unlocked}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
