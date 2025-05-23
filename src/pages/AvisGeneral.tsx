
import { useEffect } from "react";
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import BackButton from "@/components/ui/back-button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AvisGeneral = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { from: "/avis-general" } });
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-directiveplus-600"></div>
      </div>
    );
  }
  
  return (
    <QuestionnaireLayout title="Avis Général">
      <BackButton />
      <div className="w-full max-w-full flex flex-col">
        <QuestionnaireSection />
      </div>
    </QuestionnaireLayout>
  );
};

export default AvisGeneral;
