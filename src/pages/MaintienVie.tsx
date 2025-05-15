
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";

const MaintienVie = () => {
  return (
    <QuestionnaireLayout title="Maintien en Vie">
      {/* QuestionnaireSection uses the page pathname to determine the section type */}
      <QuestionnaireSection />
    </QuestionnaireLayout>
  );
};

export default MaintienVie;
