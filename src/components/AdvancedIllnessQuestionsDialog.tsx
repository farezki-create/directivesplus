
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useAdvancedIllnessQuestions } from "@/hooks/useAdvancedIllnessQuestions";
import { useAdvancedIllnessResponses } from "@/hooks/useAdvancedIllnessResponses";
import { useLanguage } from "@/hooks/useLanguage";

interface AdvancedIllnessQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedIllnessQuestionsDialog({ 
  open, 
  onOpenChange 
}: AdvancedIllnessQuestionsDialogProps) {
  const { questions, loading } = useAdvancedIllnessQuestions(open);
  const { answers, handleAnswerChange, handleSubmit } = useAdvancedIllnessResponses(open);
  const { t } = useLanguage();

  const getQuestionOptions = (question: any) => [
    { value: 'oui', label: t('yes') },
    { value: 'non', label: t('no') },
    { 
      value: 'oui_medical', 
      label: t('yesMedicalTeam')
    },
    { 
      value: 'oui_confiance', 
      label: t('yesTrustedPerson')
    }
  ];

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('advancedIllnessTitle')}
      description={t('advancedIllnessDesc')}
      onSubmit={() => handleSubmit(questions, onOpenChange)}
      loading={loading}
      questionsLength={questions.length}
    >
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value, checked) => handleAnswerChange(question.id, value, checked)}
          options={getQuestionOptions(question)}
          multiple={true}
        />
      ))}
    </QuestionsDialogLayout>
  );
}
