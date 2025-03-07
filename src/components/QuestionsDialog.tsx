
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useLanguage } from "@/hooks/language/useLanguage";
import { useQuestionnaireQuestions } from "@/hooks/questionnaire/useQuestionnaireQuestions";
import { useQuestionnaireAnswers } from "@/hooks/questionnaire/useQuestionnaireAnswers";

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionsDialog({ open, onOpenChange }: QuestionsDialogProps) {
  const { t, currentLanguage } = useLanguage();
  const { questions, loading } = useQuestionnaireQuestions('general', open);
  const { answers, handleAnswerChange, handleSubmit } = useQuestionnaireAnswers(
    'general',
    questions,
    () => onOpenChange(false)
  );

  const getQuestionOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ];
    } else {
      return [
        { value: 'oui', label: 'OUI' },
        { value: 'non', label: 'NON' }
      ];
    }
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('generalOpinion')}
      description={t('generalOpinionDesc')}
      onSubmit={handleSubmit}
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
        />
      ))}
    </QuestionsDialogLayout>
  );
}
