import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import Rediger from "./pages/Rediger";
import QuestionnaireSection from "./components/QuestionnaireSection";

const queryClient = new QueryClient();

const AppContent = () => (
  <TooltipProvider>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
      />
      {/* Routes pour les sections des directives */}
      <Route path="/rediger" element={
        <ProtectedRoute>
          <Rediger />
        </ProtectedRoute>
      } />
      <Route path="/:pageId" element={
        <ProtectedRoute>
          <PlaceholderPage />
        </ProtectedRoute>
      } />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </TooltipProvider>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <AppContent />
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
