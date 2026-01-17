import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/browse" element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
              <Route path="/song/:songId" element={<ProtectedRoute><SongLearningPage /></ProtectedRoute>} />
              <Route path="/learning" element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
              <Route path="/completed" element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
              <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
              <Route path="/challenges" element={<ProtectedRoute><ChallengesPage /></ProtectedRoute>} />
              <Route path="/vocabulary" element={<ProtectedRoute><VocabularyPage /></ProtectedRoute>} />
              <Route path="/friends" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </UserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
