
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";
import BackButton from "@/components/ui/back-button";

const MaintienVie = () => {
  console.log("Rendering MaintienVie page");
  return (
    <QuestionnaireLayout title="Maintien en Vie">
      <BackButton />
      <div className="w-full max-w-full flex flex-col">
        <QuestionnaireSection />
      </div>
    </QuestionnaireLayout>
  );
};

export default MaintienVie;
