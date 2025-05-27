
import { useLocation } from "react-router-dom";
import { getSectionTitle } from "./questionnaire/utils";
import { useQuestionnaireData } from "./questionnaire/useQuestionnaireData";
import LoadingState from "./questionnaire/LoadingState";
import ErrorState from "./questionnaire/ErrorState";
import QuestionsContainer from "./questionnaire/QuestionsContainer";
import NavigationButtons from "./questionnaire/NavigationButtons";
import QuestionnaireLayout from "./layouts/QuestionnaireLayout";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const QuestionnaireSection = () => {
  const location = useLocation();
  const pageId = location.pathname.split('/').pop() || '';
  const [hasInitialized, setHasInitialized] = useState(false);
  
  const {
    questions,
    loading,
    error,
    responses,
    saving,
    handleResponseChange,
    handleSave
  } = useQuestionnaireData(pageId);
  
  useEffect(() => {
    if (pageId && !hasInitialized && !loading) {
      console.log("QuestionnaireSection - pageId:", pageId);
      console.log("QuestionnaireSection - questions:", questions);
      console.log("QuestionnaireSection - responses:", responses);
      setHasInitialized(true);
    }
  }, [pageId, questions, loading, responses, hasInitialized]);
  
  const sectionTitle = getSectionTitle(pageId);
  
  if (loading && !hasInitialized) {
    return (
      <QuestionnaireLayout title={sectionTitle}>
        <LoadingState loading={loading} />
      </QuestionnaireLayout>
    );
  }
  
  if (error) {
    toast({
      title: "Erreur",
      description: error,
      variant: "destructive"
    });
    return (
      <QuestionnaireLayout title={sectionTitle}>
        <ErrorState error={error} />
      </QuestionnaireLayout>
    );
  }
  
  const hasQuestions = Array.isArray(questions) && questions.length > 0;

  if (!hasQuestions) {
    return (
      <QuestionnaireLayout title={sectionTitle}>
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p>Aucune question n'est disponible pour cette section.</p>
          <p className="text-sm text-gray-500 mt-2">
            Veuillez revenir ultérieurement ou contacter l'assistance.
          </p>
        </div>
      </QuestionnaireLayout>
    );
  }
  
  return (
    <QuestionnaireLayout title={sectionTitle}>
      <div className="space-y-8">
        <QuestionsContainer 
          questions={questions || []}
          responses={responses || {}}
          onResponseChange={handleResponseChange}
        />
        
        <NavigationButtons 
          onSave={handleSave}
          saving={saving}
        />
      </div>
    </QuestionnaireLayout>
  );
};

export default QuestionnaireSection;
