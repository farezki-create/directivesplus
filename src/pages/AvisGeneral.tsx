
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";

const AvisGeneral = () => {
  return (
    <QuestionnaireLayout title="Avis Général">
      {/* QuestionnaireSection uses the page pathname to determine the section type */}
      <QuestionnaireSection />
    </QuestionnaireLayout>
  );
};

export default AvisGeneral;
