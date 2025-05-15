
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";

const AvisGeneral = () => {
  console.log("Rendering AvisGeneral page");
  return (
    <QuestionnaireLayout title="Avis Général">
      <div className="w-full max-w-full flex flex-col">
        <QuestionnaireSection />
      </div>
    </QuestionnaireLayout>
  );
};

export default AvisGeneral;
