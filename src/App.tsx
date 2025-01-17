import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Healthcare from "./pages/Healthcare";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import FreeText from "./pages/FreeText";
import Examples from "./pages/Examples";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/healthcare" element={<Healthcare />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/free-text" element={<FreeText />} />
        <Route path="/examples" element={<Examples />} />
      </Routes>
    </Router>
  );
}

export default App;