
import { memo } from "react";
import { Question, Responses } from "./types";
import QuestionItem from "./QuestionItem";

interface QuestionsContainerProps {
  questions: Question[];
  responses: Responses;
  onResponseChange: (questionId: string, value: string) => void;
}

const QuestionsContainer = memo(({ questions, responses, onResponseChange }: QuestionsContainerProps) => {
  
  // Ensure questions is an array before trying to access it
  const hasQuestions = Array.isArray(questions) && questions.length > 0;
  
  if (!hasQuestions) {
    return (
      <div className="text-center p-4">
        <p>Aucune question disponible pour cette section.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {questions.map((question) => (
        <QuestionItem 
          key={question.id}
          question={question}
          response={responses[question.id] || ''}
          onResponseChange={onResponseChange}
        />
      ))}
    </div>
  );
});

QuestionsContainer.displayName = "QuestionsContainer";

export default QuestionsContainer;
