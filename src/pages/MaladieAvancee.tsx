
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";

const MaladieAvancee = () => {
  return (
    <QuestionnaireLayout title="Maladie Avancée">
      {/* QuestionnaireSection uses the page pathname to determine the section type */}
      <QuestionnaireSection />
    </QuestionnaireLayout>
  );
};

export default MaladieAvancee;
