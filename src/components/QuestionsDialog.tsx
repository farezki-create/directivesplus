
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useLanguage } from "@/hooks/useLanguage";
import { useQuestionOptions } from "./questions/QuestionOptions";
import { useGeneralOpinion } from "@/hooks/useGeneralOpinion";

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionsDialog({ open, onOpenChange }: QuestionsDialogProps) {
  const { t } = useLanguage();
  const { getQuestionOptions } = useQuestionOptions();
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
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value, checked) => handleAnswerChange(question.id, value, checked)}
          options={getQuestionOptions()}
          multiple={true} // Enable multiple selection for general opinion questions
        />
      ))}
    </QuestionsDialogLayout>
  );
}
