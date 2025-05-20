
import { useEffect } from "react";
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const MaintienVie = () => {
  console.log("Rendering MaintienVie page");
  
  // Ajout d'un debug pour suivre le rendu
  useEffect(() => {
    console.log("MaintienVie component mounted");
    return () => {
      console.log("MaintienVie component unmounted");
    };
  }, []);
  
  return (
    <ProtectedRoute>
      <QuestionnaireLayout title="Maintien en Vie">
        <div className="w-full max-w-full flex flex-col">
          <QuestionnaireSection />
        </div>
      </QuestionnaireLayout>
    </ProtectedRoute>
  );
};

export default MaintienVie;
