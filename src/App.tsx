import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/Navbar";
import HomePage from "./pages/HomePage";
import SubjectsPage from "./pages/SubjectsPage";
import SubjectDetailPage from "./pages/SubjectDetailPage";
import UnitDetailPage from "./pages/UnitDetailPage";
import TopicDetailPage from "./pages/TopicDetailPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import PresentationsPage from "./pages/PresentationsPage";
import QuizPage from "./pages/QuizPage";
import AdminPage from "./pages/AdminPage";
import ContactPage from "./pages/ContactPage";
import VideoLecturesPage from "./pages/VideoLecturesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/subjects/:subjectId" element={<SubjectDetailPage />} />
            <Route path="/subjects/:subjectId/units/:unitId" element={<UnitDetailPage />} />
            <Route path="/subjects/:subjectId/units/:unitId/topics/:topicId" element={<TopicDetailPage />} />
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/presentations" element={<PresentationsPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
