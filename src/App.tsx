
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import PlaceholderPage from "./pages/PlaceholderPage";
import QuestionnaireSection from "./components/QuestionnaireSection";
import Rediger from "./pages/Rediger";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Index />} />
    <Route path="/auth" element={<Auth />} />
    
    {/* Protected routes - Dashboard section */}
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    
    {/* Protected routes - User profile */}
    <Route path="/profile" element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    } />
    
    {/* Protected routes - Admin section */}
    <Route path="/admin" element={
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    } />
    
    {/* Protected routes - Directive sections */}
    <Route path="/rediger" element={
      <ProtectedRoute>
        <Rediger />
      </ProtectedRoute>
    } />
    
    {/* Questionnaire sections with dynamic routing */}
    <Route path="/:pageId" element={
      <ProtectedRoute>
        <QuestionnaireSection />
      </ProtectedRoute>
    } />
    
    {/* Legacy routes - will be refactored */}
    <Route path="/mes-directives" element={
      <ProtectedRoute>
        <PlaceholderPage />
      </ProtectedRoute>
    } />
    <Route path="/avis" element={
      <ProtectedRoute>
        <PlaceholderPage />
      </ProtectedRoute>
    } />
    
    {/* Specific questionnaire routes - these can be handled by the dynamic route above */}
    <Route path="/avis-general" element={
      <ProtectedRoute>
        <QuestionnaireSection />
      </ProtectedRoute>
    } />
    <Route path="/maintien-vie" element={
      <ProtectedRoute>
        <Navigate to="/maintien-vie" replace />
      </ProtectedRoute>
    } />
    <Route path="/maladie-avancee" element={
      <ProtectedRoute>
        <Navigate to="/maladie-avancee" replace />
      </ProtectedRoute>
    } />
    <Route path="/gouts-peurs" element={
      <ProtectedRoute>
        <Navigate to="/gouts-peurs" replace />
      </ProtectedRoute>
    } />
    <Route path="/personne-confiance" element={
      <ProtectedRoute>
        <Navigate to="/personne-confiance" replace />
      </ProtectedRoute>
    } />
    <Route path="/exemples-phrases" element={
      <ProtectedRoute>
        <Navigate to="/exemples-phrases" replace />
      </ProtectedRoute>
    } />
    <Route path="/synthese" element={
      <ProtectedRoute>
        <Navigate to="/synthese" replace />
      </ProtectedRoute>
    } />
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
