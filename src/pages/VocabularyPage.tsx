import { useState } from "react";
import { motion } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const VocabularyPage = () => {
  const { progress, moveWord, removeWord } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("known");

  const filterWords = (words: string[]) => {
    if (!searchQuery) return words;
    return words.filter(word => 
      word.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const WordCard = ({ 
    word, 
    category 
  }: { 
    word: string; 
    category: 'known' | 'learning' | 'review' 
  }) => {
    const categoryStyles = {
      known: "border-success/30 bg-success/5",
      learning: "border-warning/30 bg-warning/5",
      review: "border-destructive/30 bg-destructive/5",
    };

    const moveOptions = {
      known: [
        { to: 'learning' as const, label: 'Move to Learning' },
        { to: 'review' as const, label: 'Move to Review' },
      ],
      learning: [
        { to: 'known' as const, label: 'I Know This!' },
        { to: 'review' as const, label: 'Need Review' },
      ],
      review: [
        { to: 'known' as const, label: 'I Know This!' },
        { to: 'learning' as const, label: 'Move to Learning' },
      ],
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "p-4 rounded-xl border-2 transition-all hover:shadow-card",
          categoryStyles[category]
        )}
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-lg text-foreground">{word}</h4>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => removeWord(word)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {moveOptions[category].map((option) => (
            <Button
              key={option.to}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => moveWord(word, category, option.to)}
            >
              {option.label}
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              My Vocabulary
            </h1>
            <p className="text-muted-foreground">
              {progress.totalWordsLearned} words in your collection
            </p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="known" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="known" className="gap-2">
              <span className="w-2 h-2 rounded-full bg-success" />
              Known
              <Badge variant="secondary" className="ml-1">
                {progress.wordsKnown.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="learning" className="gap-2">
              <span className="w-2 h-2 rounded-full bg-warning" />
              Learning
              <Badge variant="secondary" className="ml-1">
                {progress.wordsLearning.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="review" className="gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              Review
              <Badge variant="secondary" className="ml-1">
                {progress.wordsToReview.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="known" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterWords(progress.wordsKnown).map((word) => (
                <WordCard key={word} word={word} category="known" />
              ))}
              {filterWords(progress.wordsKnown).length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  {searchQuery ? "No words match your search" : "No words in this category yet"}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="learning" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterWords(progress.wordsLearning).map((word) => (
                <WordCard key={word} word={word} category="learning" />
              ))}
              {filterWords(progress.wordsLearning).length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  {searchQuery ? "No words match your search" : "No words in this category yet"}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="review" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filterWords(progress.wordsToReview).map((word) => (
                <WordCard key={word} word={word} category="review" />
              ))}
              {filterWords(progress.wordsToReview).length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  {searchQuery ? "No words match your search" : "No words in this category yet"}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default VocabularyPage;
