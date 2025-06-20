
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
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Directives from "./pages/Directives";
import DirectivesAccess from "./pages/DirectivesAccess";
import AccessCard from "./pages/AccessCard";
import CarteAcces from "./pages/CarteAcces";
import MesDirectives from "./pages/MesDirectives";
import Synthesis from "./pages/Synthesis";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import Soutenir from "./pages/Soutenir";
import DirectivesInfo from "./pages/DirectivesInfo";
import AdminUsers from "./pages/AdminUsers";
import AdminMainDashboard from "./pages/AdminMainDashboard";

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
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/rediger" element={<Rediger />} />
            <Route path="/directives" element={<Directives />} />
            <Route path="/directives-access" element={<DirectivesAccess />} />
            <Route path="/access-card" element={<AccessCard />} />
            <Route path="/carte-acces" element={<CarteAcces />} />
            <Route path="/mes-directives" element={<MesDirectives />} />
            <Route path="/synthesis" element={<Synthesis />} />
            <Route path="/community" element={<Community />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/soutenir" element={<Soutenir />} />
            <Route path="/directives-info" element={<DirectivesInfo />} />
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
              path="/admin/users" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminUsers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminMainDashboard />
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
