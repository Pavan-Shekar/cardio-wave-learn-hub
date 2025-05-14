
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./contexts/AuthContext";
import ArticleDetail from "./pages/student/ArticleDetail";
import Leaderboard from "./pages/student/Leaderboard";

// Admin pages
import AdminPortal from "./pages/admin/AdminPortal";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageContent from "./pages/admin/ManageContent";

// Student pages
import StudentPortal from "./pages/student/StudentPortal";
import Articles from "./pages/student/Articles";
import Videos from "./pages/student/Videos";
import Quizzes from "./pages/student/Quizzes";
import QuizDetail from "./pages/student/QuizDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/content" element={<ManageContent />} />
            
            {/* Student routes */}
            <Route path="/student" element={<StudentPortal />} />
            <Route path="/student/articles" element={<Articles />} />
            <Route path="/student/articles/:id" element={<ArticleDetail />} />
            <Route path="/student/videos" element={<Videos />} />
            <Route path="/student/quizzes" element={<Quizzes />} />
            <Route path="/student/quizzes/:id" element={<QuizDetail />} />
            <Route path="/student/leaderboard" element={<Leaderboard />} />
            
            {/* Catch-all route for 404s */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
