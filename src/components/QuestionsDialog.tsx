
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuestionOptions } from "./questions/QuestionOptions";
import { QuestionWithExplanation } from "./questions/QuestionWithExplanation";
import { useGeneralOpinion } from "@/hooks/useGeneralOpinion";

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionsDialog({ open, onOpenChange }: QuestionsDialogProps) {
  const { t, currentLanguage } = useLanguage();
  const { getGeneralOpinionOptions } = useQuestionOptions();
  const { 
    questions, 
    loading, 
    answers, 
    handleAnswerChange, 
    handleSubmit 
  } = useGeneralOpinion(open);

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
      title={t('generalOpinion')}
      description={t('generalOpinionDesc')}
      onSubmit={onSubmit}
      loading={loading}
      questionsLength={questions.length}
    >
      {questions.map((question) => (
        <QuestionWithExplanation
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          options={getGeneralOpinionOptions()}
          language={currentLanguage as 'en' | 'fr'}
        />
      ))}
    </QuestionsDialogLayout>
  );
}
