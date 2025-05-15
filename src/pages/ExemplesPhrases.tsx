
import QuestionnaireLayout from "@/components/layouts/QuestionnaireLayout";
import ExamplesSection from "@/components/questionnaire/ExamplesSection";

const ExemplesPhrases = () => {
  return (
    <QuestionnaireLayout title="Exemples de Phrases">
      <p className="text-gray-600 mb-6">
        Inspirez-vous des exemples ci-dessous pour rédiger vos directives anticipées. 
        Ces phrases peuvent vous aider à formuler vos souhaits de manière claire.
      </p>
      
      <ExamplesSection />
    </QuestionnaireLayout>
  );
};

export default ExemplesPhrases;
