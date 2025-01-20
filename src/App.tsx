import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import AccessCode from "@/pages/AccessCode";
import Documents from "@/pages/Documents";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/access" element={<AccessCode />} />
        <Route path="/documents/:userId" element={<Documents />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;