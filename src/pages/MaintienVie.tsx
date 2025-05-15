
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";

const MaintienVie = () => {
  console.log("Rendering MaintienVie page");
  return (
    <QuestionnaireLayout title="Maintien en Vie">
      <div className="w-full max-w-full flex flex-col">
        <QuestionnaireSection />
      </div>
    </QuestionnaireLayout>
  );
};

export default MaintienVie;
