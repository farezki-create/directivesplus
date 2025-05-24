import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { Home } from "./pages/Home";
import { Profile } from "./pages/Profile";
import { authRoutes } from "./routes/auth";
import { dashboardRoutes } from "./routes/dashboard";
import { adminRoutes } from "./routes/admin";
import { DirectivesAcces } from "./pages/DirectivesAcces";
import MesDirectives from "./pages/MesDirectives";
import Partage from "./pages/Partage";
import DirectDocument from "./pages/DirectDocument";
import { QueryClient, QueryClientProvider } from "react-query";
import { Sonner } from "./components/ui/sonner";
import PdfViewer from "./pages/PdfViewer";
import PdfDirect from "./pages/PdfDirect";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            {authRoutes}
            {dashboardRoutes}
            {adminRoutes}
            <Route path="/directives-acces" element={<DirectivesAcces />} />
            <Route path="/mes-directives" element={<MesDirectives />} />
            <Route path="/partage" element={<Partage />} />
            <Route path="/document/:documentId" element={<DirectDocument />} />
            
            {/* Nouvelles routes pour la visualisation PDF */}
            <Route path="/pdf-viewer" element={<PdfViewer />} />
            <Route path="/pdf/:documentId" element={<PdfDirect />} />
          </Routes>
          <Toaster />
          <Sonner />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
