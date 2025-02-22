
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Examples from "@/pages/Examples";
import FreeText from "@/pages/FreeText";
import ResetPassword from "@/pages/ResetPassword";
import GeneratePDF from "@/pages/GeneratePDF";
import Reviews from "@/pages/Reviews";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/examples" element={<Examples />} />
        <Route path="/free-text" element={<FreeText />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/generate-pdf" element={<GeneratePDF />} />
        <Route path="/reviews" element={<Reviews />} />
      </Routes>
    </Router>
  );
}

export default App;
