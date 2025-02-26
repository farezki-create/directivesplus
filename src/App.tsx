
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Layout from "@/components/layout";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import FreeText from "@/pages/FreeText";
import PDFManagement from "@/pages/PDFManagement";
import GeneratePDF from "@/pages/GeneratePDF";
import Examples from "@/pages/Examples";
import Reviews from "@/pages/Reviews";
import MoreInfo from "@/pages/MoreInfo";
import ResetPassword from "@/pages/ResetPassword";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/" element={<Layout isIndex />}>
              <Route index element={<Index />} />
            </Route>
            <Route path="/" element={<Layout />}>
              <Route path="auth" element={<Auth />} />
              <Route path="dashboard/*" element={<Dashboard />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="free-text" element={<FreeText />} />
              <Route path="generate-pdf/:id?" element={<GeneratePDF />} />
              <Route path="pdf-management" element={<PDFManagement />} />
              <Route path="examples" element={<Examples />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="more-info" element={<MoreInfo />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          <Toaster />
          <Sonner position="top-right" />
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
