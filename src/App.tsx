
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Rediger from "./pages/Rediger";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/rediger" element={<Rediger />} />
              <Route path="/faq" element={<FAQ />} />
              {/* Placeholder routes for the other pages */}
              <Route path="/mes-directives" element={<Rediger />} />
              <Route path="/mes-documents" element={<Rediger />} />
              <Route path="/mes-donnees-medicales" element={<Rediger />} />
              <Route path="/langue" element={<Rediger />} />
              <Route path="/acces-professionnel" element={<Rediger />} />
              <Route path="/en-savoir-plus" element={<FAQ />} />
              <Route path="/questionnaire/avis-general" element={<Rediger />} />
              <Route path="/questionnaire/maintien-vie" element={<Rediger />} />
              <Route path="/questionnaire/maladie-avancee" element={<Rediger />} />
              <Route path="/questionnaire/gouts-peurs" element={<Rediger />} />
              <Route path="/questionnaire/personne-confiance" element={<Rediger />} />
              <Route path="/exemples-phrases" element={<Rediger />} />
              <Route path="/synthese" element={<Rediger />} />
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
