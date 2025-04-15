
import { QuestionWithExplanation } from "./questions/QuestionWithExplanation";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useLanguage } from "@/hooks/useLanguage";
import { useAdvancedIllnessQuestions } from "@/hooks/useAdvancedIllnessQuestions";
import { useAdvancedIllnessResponses } from "@/hooks/useAdvancedIllnessResponses";
import { useQuestionOptions } from "./questions/QuestionOptions";
import { QuestionExplanationAccordion } from "./questions/QuestionExplanationAccordion";

interface AdvancedIllnessQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedIllnessQuestionsDialog({ 
  open, 
  onOpenChange 
}: AdvancedIllnessQuestionsDialogProps) {
  const { t, currentLanguage } = useLanguage();
  const { questions, loading } = useAdvancedIllnessQuestions(open);
  const { answers, handleAnswerChange, handleSubmit } = useAdvancedIllnessResponses(questions);
  const { getAdvancedIllnessOptions } = useQuestionOptions();

  // Debug logs
  console.log("AdvancedIllnessQuestionsDialog - questions count:", questions.length);
  console.log("AdvancedIllnessQuestionsDialog - language:", currentLanguage);
  if (questions.length > 0) {
    console.log("First question explanation:", questions[0].explanation || "No direct explanation");
  }

  const onSubmit = async () => {
    const success = await handleSubmit();
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('advancedIllnessTitle')}
      description={t('advancedIllnessDesc')}
      onSubmit={onSubmit}
      loading={loading}
      questionsLength={questions.length}
    >
      {questions.map((question, index) => {
        // Ensure we have all necessary properties standardized
        const questionWithOrder = {
          ...question,
          display_order: question.display_order || index + 1,
          display_order_str: question.display_order_str || (index + 1).toString(),
          question: question.question || question.question_text,
          question_text: question.question_text || question.question,
          // Use the explanation directly from the database
          explanation: question.explanation || ''
        };
        
        // Debug each question
        console.log(`Question ${index + 1}: ID=${question.id}, display_order=${questionWithOrder.display_order}`);
        console.log(`Database explanation for question ${question.id}: ${question.explanation ? 'Present' : 'Not present'}`);
        
        return (
          <div className="mb-8" key={question.id}>
            <div className="p-6 bg-card rounded-lg border shadow-sm">
              <QuestionCard
                question={questionWithOrder}
                value={answers[question.id] || []}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                options={getAdvancedIllnessOptions()}
              />
              
              {/* Use the QuestionExplanationAccordion with the explanation from the database */}
              <QuestionExplanationAccordion 
                explanationText={questionWithOrder.explanation} 
                language={currentLanguage as 'en' | 'fr'} 
              />
            </div>
          </div>
        );
      })}
    </QuestionsDialogLayout>
  );
}

// Helper component for rendering question without creating a new file
function QuestionCard({ question, value, onValueChange, options }) {
  return (
    <div>
      <p className="text-lg font-medium mb-4">
        {question.question}
      </p>
      <div className="flex flex-col space-y-3">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              type="radio"
              id={`${question.id}-${option.value}`}
              name={`question-${question.id}`}
              checked={value.includes(option.value)}
              onChange={() => onValueChange(option.value)}
              className="h-4 w-4"
            />
            <label 
              htmlFor={`${question.id}-${option.value}`}
              className="text-base"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
