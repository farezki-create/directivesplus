
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";
import BackButton from "@/components/ui/back-button";

const MaladieAvancee = () => {
  return (
    <QuestionnaireLayout title="Maladie Avancée">
      <BackButton />
      <div className="w-full max-w-full flex flex-col">
        <QuestionnaireSection />
      </div>
    </QuestionnaireLayout>
  );
};

export default MaladieAvancee;
