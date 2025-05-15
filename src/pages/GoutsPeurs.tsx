
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";

const GoutsPeurs = () => {
  return (
    <QuestionnaireLayout title="Goûts et Peurs">
      {/* QuestionnaireSection uses the page pathname to determine the section type */}
      <QuestionnaireSection />
    </QuestionnaireLayout>
  );
};

export default GoutsPeurs;
