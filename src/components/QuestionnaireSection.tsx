
import { useLocation } from "react-router-dom";
import { getSectionTitle, getSectionTable } from "./questionnaire/utils";
import { useQuestionnaireData } from "./questionnaire/useQuestionnaireData";
import LoadingState from "./questionnaire/LoadingState";
import ErrorState from "./questionnaire/ErrorState";
import QuestionsContainer from "./questionnaire/QuestionsContainer";
import NavigationButtons from "./questionnaire/NavigationButtons";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";

const QuestionnaireSection = () => {
  const location = useLocation();
  const pageId = location.pathname.split('/').pop() || '';
  
  const {
    questions,
    loading,
    error,
    responses,
    saving,
    handleResponseChange,
    handleSave
  } = useQuestionnaireData(pageId);
  
  // Ajouter des logs pour le débogage
  useEffect(() => {
    console.log("QuestionnaireSection - pageId:", pageId);
    console.log("QuestionnaireSection - table:", getSectionTable(pageId));
    console.log("QuestionnaireSection - questions:", questions);
    console.log("QuestionnaireSection - loading:", loading);
    console.log("QuestionnaireSection - error:", error);
  }, [pageId, questions, loading, error]);
  
  if (loading) {
    return <LoadingState loading={loading} />;
  }
  
  if (error) {
    // Afficher une notification toast pour les erreurs
    toast({
      title: "Erreur",
      description: error,
      variant: "destructive"
    });
    return <ErrorState error={error} />;
  }
  
  // Vérifier si nous avons des questions après le chargement
  if (!questions || questions.length === 0) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-6">
          {getSectionTitle(pageId)}
        </h1>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p>Aucune question n'est disponible pour cette section.</p>
          <p className="text-sm text-gray-500 mt-2">
            Veuillez revenir ultérieurement ou contacter l'assistance.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        {getSectionTitle(pageId)}
      </h1>
      
      <QuestionsContainer 
        questions={questions}
        responses={responses}
        onResponseChange={handleResponseChange}
      />
      
      <NavigationButtons 
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
};

export default QuestionnaireSection;
