
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useLanguage } from "@/hooks/language/useLanguage";
import { useLifeSupportQuestions } from "@/hooks/life-support/useLifeSupportQuestions";
import { useLifeSupportAnswers } from "@/hooks/life-support/useLifeSupportAnswers";
import { LifeSupportQuestionsList } from "./life-support/LifeSupportQuestionsList";

interface LifeSupportQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LifeSupportQuestionsDialog({ 
  open, 
  onOpenChange 
}: LifeSupportQuestionsDialogProps) {
  const { t } = useLanguage();
  const { questions, loading } = useLifeSupportQuestions(open);
  const { answers, handleAnswerChange, handleSubmit } = useLifeSupportAnswers(
    questions, 
    () => onOpenChange(false)
  );

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('lifeSupport')}
      description={t('advancedIllnessDesc')}
      onSubmit={handleSubmit}
      loading={loading}
      questionsLength={questions.length}
    >
      <LifeSupportQuestionsList
        questions={questions}
        answers={answers}
        onValueChange={handleAnswerChange}
      />
    </QuestionsDialogLayout>
  );
}
