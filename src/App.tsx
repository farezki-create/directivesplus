import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Healthcare from "@/pages/Healthcare";
import HealthcareDashboard from "@/pages/HealthcareDashboard";
import HealthcareLanding from "@/pages/HealthcareLanding";
import Examples from "@/pages/Examples";
import FreeText from "@/pages/FreeText";
import ResetPassword from "@/pages/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/healthcare" element={<Healthcare />} />
        <Route path="/healthcare-landing" element={<HealthcareLanding />} />
        <Route path="/healthcare-dashboard" element={<HealthcareDashboard />} />
        <Route path="/examples" element={<Examples />} />
        <Route path="/free-text" element={<FreeText />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;