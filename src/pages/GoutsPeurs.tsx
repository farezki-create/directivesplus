
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";

const GoutsPeurs = () => {
  console.log("Rendering GoutsPeurs page");
  return (
    <QuestionnaireLayout title="Goûts et Peurs">
      <div className="w-full">
        <QuestionnaireSection />
      </div>
    </QuestionnaireLayout>
  );
};

export default GoutsPeurs;
