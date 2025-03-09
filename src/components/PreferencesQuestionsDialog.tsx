
import { QuestionWithExplanation } from "./questions/QuestionWithExplanation";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useLanguage } from "@/hooks/useLanguage";
import { usePreferencesQuestions } from "@/hooks/usePreferencesQuestions";
import { usePreferencesResponses } from "@/hooks/usePreferencesResponses";
import { useQuestionOptions } from "./questions/QuestionOptions";

interface PreferencesQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreferencesQuestionsDialog({
  open,
  onOpenChange,
}: PreferencesQuestionsDialogProps) {
  const { t, currentLanguage } = useLanguage();
  const { questions, loading } = usePreferencesQuestions(open);
  const { answers, handleAnswerChange, handleSubmit } = usePreferencesResponses(questions);
  const { getPreferencesOptions } = useQuestionOptions();

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
      title={t('preferences')}
      description={t('preferencesDesc')}
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
          options={getPreferencesOptions()}
          language={currentLanguage as 'en' | 'fr'}
        />
      ))}
    </QuestionsDialogLayout>
  );
}
