
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { DialogStateProvider } from "@/hooks/useDialogState";

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import FAQ from "./pages/FAQ";
import FreeText from "./pages/FreeText";
import Examples from "./pages/Examples";
import GeneratePDF from "./pages/GeneratePDF";
import MoreInfo from "./pages/MoreInfo";
import Reviews from "./pages/Reviews";

import "./App.css";

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="advance-directives-theme">
      <DialogStateProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/free-text" element={<FreeText />} />
            <Route path="/examples" element={<Examples />} />
            <Route path="/generate-pdf" element={<GeneratePDF />} />
            <Route path="/more-info" element={<MoreInfo />} />
            <Route path="/reviews" element={<Reviews />} />
          </Routes>
        </Router>
        <Toaster />
      </DialogStateProvider>
    </ThemeProvider>
  );
}

export default App;
