
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import QuestionnaireSection from "@/components/QuestionnaireSection";
import BackButton from "@/components/ui/back-button";

const GoutsPeurs = () => {
  console.log("Rendering GoutsPeurs page");
  return (
    <QuestionnaireLayout title="Goûts et Peurs">
      <BackButton />
      <div className="w-full max-w-full flex flex-col">
        <QuestionnaireSection />
      </div>
    </QuestionnaireLayout>
  );
};

export default GoutsPeurs;
