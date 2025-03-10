
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

  // For debugging
  console.log("AdvancedIllnessQuestionsDialog - questions:", questions);
  console.log("AdvancedIllnessQuestionsDialog - language:", currentLanguage);

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
      {questions.map((question) => {
        // For debugging each question
        console.log(`Question ${question.display_order}: ID=${question.id}`);
        
        return (
          <QuestionWithExplanation
            key={question.id}
            question={question}
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
