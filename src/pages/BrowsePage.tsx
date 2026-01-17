import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { SongCard } from "@/components/SongCard";
import { languages, difficultyColors } from "@/data/mockData";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Filter, Music, Loader2 } from "lucide-react";
import { useSongsSearch, usePopularSongs } from "@/hooks/useSongs";
import { useDebounce } from "@/hooks/useDebounce";

const difficulties = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const BrowsePage = () => {
  const navigate = useNavigate();
  const { selectedLanguage } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);

  // Debounce search query to avoid excessive API calls
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Fetch popular songs on initial load (when no search query)
  const { data: popularSongs = [], isLoading: popularLoading } = usePopularSongs(20);

  // Fetch songs from API with filters when searching
  const { data: searchResults = [], isLoading: searchLoading, isError } = useSongsSearch({
    query: debouncedQuery || undefined,
    difficulty: selectedDifficulty || undefined,
    enabled: !!debouncedQuery, // Only search when there's a query
  });

  // Use popular songs when no search, search results when searching
  const songs = debouncedQuery ? searchResults : popularSongs;
  const isLoading = debouncedQuery ? searchLoading : popularLoading;

  // Filter by difficulty if selected (for popular songs)
  const filteredSongs = useMemo(() => {
    if (!selectedDifficulty) return songs;
    return songs.filter(song => song.difficulty === selectedDifficulty);
  }, [songs, selectedDifficulty]);

  // Group songs by language
  const songsByLanguage = useMemo(() => {
    const grouped: Record<string, typeof filteredSongs> = {};
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
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <span className="ml-3 text-muted-foreground">Searching songs...</span>
          </motion.div>
        )}

        {/* Error State */}
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-destructive/10 rounded-xl p-6 text-center"
          >
            <p className="text-destructive">Failed to load songs. Using offline data.</p>
          </motion.div>
        )}

        {/* Songs by Language */}
        {!isLoading && Object.keys(songsByLanguage).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(songsByLanguage).map(([lang, langSongs], sectionIndex) => {
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
                      {langSongs.length} songs
                    </Badge>
                  </h2>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {langSongs.map((song, index) => (
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
        ) : !isLoading && (
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
