
import { QuestionWithExplanation } from "./questions/QuestionWithExplanation";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useLanguage } from "@/hooks/useLanguage";
import { useAdvancedIllnessQuestions } from "@/hooks/useAdvancedIllnessQuestions";
import { useAdvancedIllnessResponses } from "@/hooks/useAdvancedIllnessResponses";
import { useQuestionOptions } from "./questions/QuestionOptions";

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

  // Pour le débogage
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
        // Ensure display_order is available for explanation lookup
        const questionWithOrder = {
          ...question,
          display_order: question.display_order || index + 1,
          display_order_str: question.display_order_str || (index + 1).toString(),
          // Make sure both question and question_text are available
          question: question.question || question.question_text,
          question_text: question.question_text || question.question,
          // Pass through database explanation
          explanation: question.explanation || ''
        };
        
        // Pour le débogage de chaque question
        console.log(`Question ${index + 1}: ID=${question.id}, display_order=${questionWithOrder.display_order}, display_order_str=${questionWithOrder.display_order_str}`);
        console.log(`Explanation for question ${question.id}: ${question.explanation ? 'Present in DB' : 'Not in DB'}`);
        
        return (
          <QuestionWithExplanation
            key={question.id}
            question={questionWithOrder}
            value={answers[question.id] || []}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            options={getAdvancedIllnessOptions()}
            language={currentLanguage as 'en' | 'fr'}
          />
        );
      })}
    </QuestionsDialogLayout>
  );
}
