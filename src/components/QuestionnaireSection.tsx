
import { useParams } from "react-router-dom";
import { getSectionTitle } from "./questionnaire/utils";
import { useQuestionnaireData } from "./questionnaire/useQuestionnaireData";
import LoadingState from "./questionnaire/LoadingState";
import ErrorState from "./questionnaire/ErrorState";
import QuestionsContainer from "./questionnaire/QuestionsContainer";
import NavigationButtons from "./questionnaire/NavigationButtons";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const QuestionnaireSection = () => {
  const { pageId } = useParams<{ pageId: string }>();
  
  const {
    questions,
    loading,
    error,
    responses,
    saving,
    handleResponseChange,
    handleSave
  } = useQuestionnaireData(pageId || 'avis-general'); // Fallback to 'avis-general' if no pageId
  
  // Debug logs
  useEffect(() => {
    console.log('QuestionnaireSection rendered with pageId:', pageId);
    console.log('Questions loaded:', questions?.length || 0);
    console.log('Loading state:', loading);
    console.log('Error state:', error);
    console.log('Current responses:', responses);
  }, [pageId, questions, loading, error, responses]);
  
  if (loading) {
    return <LoadingState loading={loading} />;
  }
  
  if (error) {
    return <ErrorState error={error} />;
  }

  const currentPageId = pageId || 'avis-general';
  const sectionTitle = getSectionTitle(currentPageId);
  
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Top back button */}
      <div className="flex justify-start mb-2">
        <Button 
          variant="outline" 
          asChild
          className="flex items-center"
        >
          <Link to="/rediger">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Link>
        </Button>
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-6">
        {sectionTitle || 'Questionnaire'}
      </h1>
      
      {questions.length === 0 ? (
        <div className="text-center p-6 bg-gray-100 rounded-md">
          <p>Aucune question disponible pour cette section.</p>
        </div>
      ) : (
        <QuestionsContainer 
          questions={questions}
          responses={responses}
          onResponseChange={handleResponseChange}
        />
      )}
      
      <NavigationButtons 
        onSave={handleSave}
        saving={saving}
      />
    </div>
  );
};

export default QuestionnaireSection;
