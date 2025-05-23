
import { memo } from "react";
import { Question, Responses } from "./types";
import QuestionsContainer from "./QuestionsContainer";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

interface QuestionnaireContentProps {
  questions: Question[];
  responses: Responses;
  loading: boolean;
  error: string | null;
  onResponseChange: (questionId: string, value: string) => void;
}

const QuestionnaireContent = memo(({ 
  questions, 
  responses, 
  loading, 
  error, 
  onResponseChange 
}: QuestionnaireContentProps) => {
  if (loading) return <LoadingState loading={loading} />;
  if (error) return <ErrorState error={error} />;

  return (
    <QuestionsContainer 
      questions={questions}
      responses={responses}
      onResponseChange={onResponseChange}
    />
  );
});

QuestionnaireContent.displayName = "QuestionnaireContent";

export default QuestionnaireContent;
