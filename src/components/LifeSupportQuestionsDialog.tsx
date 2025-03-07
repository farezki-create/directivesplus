
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useLanguage } from "@/hooks/language/useLanguage";
import { LifeSupportQuestionsList } from "./life-support/LifeSupportQuestionsList";
import { useQuestionnaireQuestions } from "@/hooks/questionnaire/useQuestionnaireQuestions";
import { useQuestionnaireAnswers } from "@/hooks/questionnaire/useQuestionnaireAnswers";

interface LifeSupportQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LifeSupportQuestionsDialog({ 
  open, 
  onOpenChange 
}: LifeSupportQuestionsDialogProps) {
  const { t } = useLanguage();
  const { questions, loading } = useQuestionnaireQuestions('life_support', open);
  const { answers, handleAnswerChange, handleSubmit } = useQuestionnaireAnswers(
    'life_support',
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
