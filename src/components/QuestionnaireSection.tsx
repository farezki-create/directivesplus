
import { useLocation, useNavigate } from "react-router-dom";
import { getSectionTitle } from "./questionnaire/utils";
import { useQuestionnaireData } from "./questionnaire/useQuestionnaireData";
import LoadingState from "./questionnaire/LoadingState";
import ErrorState from "./questionnaire/ErrorState";
import QuestionsContainer from "./questionnaire/QuestionsContainer";
import NavigationButtons from "./questionnaire/NavigationButtons";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const QuestionnaireSection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pageId = location.pathname.split('/').pop() || '';
  // Add a flag to prevent repeated renders during initial load
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
  
  // Add debug logs
  useEffect(() => {
    if (pageId && !hasInitialized && !loading) {
      console.log("QuestionnaireSection - pageId:", pageId);
      console.log("QuestionnaireSection - questions:", questions);
      console.log("QuestionnaireSection - responses:", responses);
      setHasInitialized(true);
    }
  }, [pageId, questions, loading, responses, hasInitialized]);
  
  // Prevent showing loading state after the component has initialized
  if (loading && !hasInitialized) {
    return <LoadingState loading={loading} />;
  }
  
  if (error) {
    toast({
      title: "Erreur",
      description: error,
      variant: "destructive"
    });
    return <ErrorState error={error} />;
  }
  
  // Check if we have questions
  const hasQuestions = Array.isArray(questions) && questions.length > 0;

  if (!hasQuestions) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/rediger")}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Retour à la rédaction
          </Button>
        </div>
        
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
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate("/rediger")}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Retour à la rédaction
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-6">
        {getSectionTitle(pageId)}
      </h1>
      
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
  );
};

export default QuestionnaireSection;
