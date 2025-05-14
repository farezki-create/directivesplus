
import { useParams } from "react-router-dom";
import { getSectionTitle } from "./questionnaire/utils";
import { useQuestionnaireData } from "./questionnaire/useQuestionnaireData";
import LoadingState from "./questionnaire/LoadingState";
import ErrorState from "./questionnaire/ErrorState";
import QuestionsContainer from "./questionnaire/QuestionsContainer";
import NavigationButtons from "./questionnaire/NavigationButtons";

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
  } = useQuestionnaireData(pageId);
  
  if (loading) {
    return <LoadingState loading={loading} />;
  }
  
  if (error) {
    return <ErrorState error={error} />;
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
