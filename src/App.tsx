
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AuthAudit from "./pages/AuthAudit";
import SecurityAuditPage from "./pages/SecurityAuditPage";
import Admin from "./pages/Admin";
import AdminStrictRLS from "./pages/AdminStrictRLS";
import Rediger from "./pages/Rediger";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rediger" element={<Rediger />} />
            <Route path="/auth-audit" element={<AuthAudit />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <Admin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/security-audit" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <SecurityAuditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/security-audit-report" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <SecurityAuditPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/strict-rls" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminStrictRLS />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
