
import { useGeneralQuestions } from "@/hooks/questions/useGeneralQuestions";
import { useGeneralAnswers } from "@/hooks/questions/useGeneralAnswers";
import { useQuestionOptions } from "@/hooks/questions/useQuestionOptions";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useLanguage } from "@/hooks/language/useLanguage";

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionsDialog({ open, onOpenChange }: QuestionsDialogProps) {
  const { t } = useLanguage();
  const { questions, loading } = useGeneralQuestions(open);
  const { answers, handleAnswerChange, handleSubmit } = useGeneralAnswers(questions);
  const { getQuestionOptions } = useQuestionOptions();

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('generalOpinion')}
      description={t('generalOpinionDesc')}
      onSubmit={() => handleSubmit(() => onOpenChange(false))}
      loading={loading}
      questionsLength={questions.length}
    >
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value, checked) => handleAnswerChange(question.id, value, checked as boolean)}
          options={getQuestionOptions()}
        />
      ))}
    </QuestionsDialogLayout>
  );
}
