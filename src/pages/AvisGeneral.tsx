
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

const AvisGeneral = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isPageLocked, setIsPageLocked] = useState(true);
  
  // This effect stabilizes the page and prevents redirect loops
  useEffect(() => {
    console.log("Avis General page loaded and locked");
    
    // Mark the page as ready after authentication check is complete
    // This prevents any unwanted redirects from inside components
    setIsPageLocked(false);
    
    // Debug log to track authentication status when component loads
    console.log("Auth status on AvisGeneral load:", isAuthenticated ? "Authenticated" : "Not authenticated");
  }, [isAuthenticated]);

  console.log("Rendering AvisGeneral page, locked:", isPageLocked);
  return (
    <ProtectedRoute>
      <QuestionnaireLayout title="Avis Général">
        <div className="w-full max-w-full flex flex-col">
          <QuestionnaireSection />
        </div>
      </QuestionnaireLayout>
    </ProtectedRoute>
  );
};

export default AvisGeneral;
