
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";

const MaladieAvancee = () => {
  console.log("Rendering MaladieAvancee page");
  return (
    <QuestionnaireLayout title="Maladie Avancée">
      <div className="w-full">
        <QuestionnaireSection />
      </div>
    </QuestionnaireLayout>
  );
};

export default MaladieAvancee;
