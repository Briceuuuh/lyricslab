import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/context/AuthContext";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import SongLearningPage from "./pages/SongLearningPage";
import ChallengesPage from "./pages/ChallengesPage";
import ProgressPage from "./pages/ProgressPage";
import VocabularyPage from "./pages/VocabularyPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/song/:songId" element={<SongLearningPage />} />
              <Route path="/learning" element={<BrowsePage />} />
              <Route path="/completed" element={<BrowsePage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/challenges" element={<ChallengesPage />} />
              <Route path="/vocabulary" element={<VocabularyPage />} />
              <Route path="/friends" element={<ProgressPage />} />
              <Route path="/settings" element={<ProgressPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
