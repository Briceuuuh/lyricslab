import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { SongCard } from "@/components/SongCard";
import { mockSongs, languages, difficultyColors, Song } from "@/data/mockData";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Filter, Music, Loader2 } from "lucide-react";
import { useSearchSongs } from "@/hooks/useApi";
import { useDebounce } from "@/hooks/useDebounce";

const difficulties = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const BrowsePage = () => {
  const navigate = useNavigate();
  const { selectedLanguage } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  
  // Use API for search when query exists
  const { data: apiSongs, isLoading, isError } = useSearchSongs(
    debouncedSearch,
    selectedLanguage,
    selectedDifficulty || undefined
  );

  // Use API results if available, otherwise fall back to mock data
  const filteredSongs = useMemo(() => {
    // If we have search results from API, use them
    if (debouncedSearch && apiSongs && apiSongs.length > 0) {
      return apiSongs;
    }
    
    // Otherwise filter mock data locally
    return mockSongs.filter(song => {
      const matchesSearch = searchQuery === "" ||
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesDifficulty = !selectedDifficulty || song.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesDifficulty;
    });
  }, [searchQuery, debouncedSearch, selectedDifficulty, apiSongs]);

  const songsByLanguage = useMemo(() => {
    const grouped: Record<string, Song[]> = {};
    filteredSongs.forEach(song => {
      const lang = song.languageLabel;
      if (!grouped[lang]) grouped[lang] = [];
      grouped[lang].push(song);
    });
    return grouped;
  }, [filteredSongs]);

  return (
    <MainLayout onSearch={setSearchQuery}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-foreground">Browse Songs</h1>
          <p className="text-muted-foreground">
            Discover new songs to learn vocabulary from
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-3"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <Filter className="w-4 h-4" />
            <span className="text-sm font-medium">Difficulty:</span>
          </div>
          
          <Badge
            variant={selectedDifficulty === null ? "default" : "secondary"}
            className={cn(
              "cursor-pointer transition-all",
              selectedDifficulty === null && "gradient-primary text-primary-foreground"
            )}
            onClick={() => setSelectedDifficulty(null)}
          >
            All
          </Badge>
          
          {difficulties.map(diff => {
            const colors = difficultyColors[diff];
            const isSelected = selectedDifficulty === diff;
            
            return (
              <Badge
                key={diff}
                variant="secondary"
                className={cn(
                  "cursor-pointer transition-all",
                  isSelected ? cn(colors.bg, colors.text, "border-2 border-current") : "hover:bg-muted"
                )}
                onClick={() => setSelectedDifficulty(isSelected ? null : diff)}
              >
                {diff}
              </Badge>
            );
          })}
        </motion.div>

        {/* Loading State */}
        {isLoading && debouncedSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Searching songs...</span>
          </motion.div>
        )}

        {/* Songs by Language */}
        {!isLoading && Object.keys(songsByLanguage).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(songsByLanguage).map(([lang, songs], sectionIndex) => {
              const langData = languages.find(l => l.label === lang);
              
              return (
                <motion.section
                  key={lang}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 }}
                  className="space-y-4"
                >
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <span className="text-2xl">{langData?.flag}</span>
                    {lang}
                    <Badge variant="secondary" className="ml-2">
                      {songs.length} songs
                    </Badge>
                  </h2>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {songs.map((song, index) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        index={index}
                        onClick={() => navigate(`/song/${song.id}`)}
                      />
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-muted rounded-xl p-12 text-center"
          >
            <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No songs found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default BrowsePage;
