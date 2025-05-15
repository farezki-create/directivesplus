
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const AvisGeneral = () => {
  const navigate = useNavigate();
  
  // This effect will prevent automatic redirects when the page loads
  useEffect(() => {
    console.log("Avis General page loaded and locked");
    // We're intentionally not redirecting anywhere
    
    // If there are any history listeners or redirect attempts,
    // we can block navigation attempts with this:
    const preventNavigation = (e: BeforeUnloadEvent) => {
      console.log("Navigation attempt prevented");
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    
    // Only uncomment this if you need to actually block page navigation
    // window.addEventListener('beforeunload', preventNavigation);
    // return () => window.removeEventListener('beforeunload', preventNavigation);
  }, []);

  console.log("Rendering AvisGeneral page");
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
