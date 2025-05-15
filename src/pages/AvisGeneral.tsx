
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";

const AvisGeneral = () => {
  console.log("Rendering AvisGeneral page");
  return (
    <QuestionnaireLayout title="Avis Général">
      <QuestionnaireSection />
    </QuestionnaireLayout>
  );
};

export default AvisGeneral;
