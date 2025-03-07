
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/language/useLanguage";
import { useQuestionnaireQuestions } from "@/hooks/questionnaire/useQuestionnaireQuestions";
import { useQuestionnaireAnswers } from "@/hooks/questionnaire/useQuestionnaireAnswers";

interface PreferencesQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreferencesQuestionsDialog({
  open,
  onOpenChange,
}: PreferencesQuestionsDialogProps) {
  const { t, currentLanguage } = useLanguage();
  const { questions, loading } = useQuestionnaireQuestions('preferences', open);
  const { answers, handleAnswerChange, handleSubmit } = useQuestionnaireAnswers(
    'preferences',
    questions,
    () => onOpenChange(false)
  );

  // Options de réponse selon la langue
  const getAnswerOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { label: 'Yes', value: "yes" },
        { label: 'No', value: "no" },
        { label: 'I don\'t know', value: "undecided" }
      ];
    } else {
      return [
        { label: t('yes'), value: "oui" },
        { label: t('no'), value: "non" },
        { label: t('dontKnow'), value: "indecis" }
      ];
    }
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('preferences')}
      onSubmit={handleSubmit}
      loading={loading}
      questionsLength={questions?.length || 0}
    >
      {questions?.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value, checked) => handleAnswerChange(question.id, value, checked)}
          options={getAnswerOptions()}
        />
      ))}
    </QuestionsDialogLayout>
  );
}
