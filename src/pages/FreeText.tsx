import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { QuestionnaireSection } from "@/components/questionnaire/QuestionnaireSection";
import { FreeTextForm } from "@/components/questionnaire/FreeTextForm";
import { useQuestionnaireAnswers } from "@/components/questionnaire/useQuestionnaireAnswers";

const FreeText = () => {
  const { data: generalAnswers, isLoading: loadingGeneral } = useQuestionnaireAnswers("general_opinion");
  const { data: lifeSupportAnswers, isLoading: loadingLifeSupport } = useQuestionnaireAnswers("life_support");
  const { data: advancedIllnessAnswers, isLoading: loadingAdvancedIllness } = useQuestionnaireAnswers("advanced_illness");
  const { data: preferencesAnswers, isLoading: loadingPreferences } = useQuestionnaireAnswers("preferences");

  const isLoading = loadingGeneral || loadingLifeSupport || loadingAdvancedIllness || loadingPreferences;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Synthèse et expression libre</h1>
          
          <div className="mb-8 p-4 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Synthèse de vos réponses</h2>
            
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <>
                <QuestionnaireSection title="Mon avis général" answers={generalAnswers} />
                <QuestionnaireSection title="Maintien de la vie" answers={lifeSupportAnswers} />
                <QuestionnaireSection title="Maladie avancée" answers={advancedIllnessAnswers} />
                <QuestionnaireSection title="Mes goûts et mes peurs" answers={preferencesAnswers} />
              </>
            )}
          </div>

          <FreeTextForm />
        </div>
      </main>
    </div>
  );
};

export default FreeText;