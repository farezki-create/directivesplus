
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/language/useLanguage";
import { useQuestionnaireQuestions } from "@/hooks/questionnaire/useQuestionnaireQuestions";
import { useQuestionnaireAnswers } from "@/hooks/questionnaire/useQuestionnaireAnswers";

interface AdvancedIllnessQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedIllnessQuestionsDialog({ 
  open, 
  onOpenChange 
}: AdvancedIllnessQuestionsDialogProps) {
  const { t, currentLanguage } = useLanguage();
  const { questions, loading } = useQuestionnaireQuestions('advanced_illness', open);
  const { answers, handleAnswerChange, handleSubmit } = useQuestionnaireAnswers(
    'advanced_illness',
    questions,
    () => onOpenChange(false),
    true // allow multiple answers
  );

  const getQuestionOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'yes_medical', label: 'Yes if the medical team deems it useful' },
        { value: 'yes_trusted', label: 'Yes if my trusted person deems it useful' }
      ];
    } else {
      return [
        { value: 'oui', label: t('yes') },
        { value: 'non', label: t('no') },
        { value: 'oui_medical', label: t('yesMedicalTeam') },
        { value: 'oui_confiance', label: t('yesTrustedPerson') }
      ];
    }
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('advancedIllnessTitle')}
      description={t('advancedIllnessDesc')}
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
          multiple={true}
        />
      ))}
    </QuestionsDialogLayout>
  );
}
