
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";
import BackButton from "@/components/ui/back-button";

const AvisGeneral = () => {
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
