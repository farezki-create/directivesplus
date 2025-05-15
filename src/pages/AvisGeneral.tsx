
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const AvisGeneral = () => {
  console.log("Rendering AvisGeneral component");
  
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
