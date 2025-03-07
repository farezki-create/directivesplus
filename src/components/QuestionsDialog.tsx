
import { useGeneralQuestions } from "@/hooks/questions/useGeneralQuestions";
import { useGeneralAnswers } from "@/hooks/questions/useGeneralAnswers";
import { useQuestionOptions } from "@/hooks/questions/useQuestionOptions";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useLanguage } from "@/hooks/language/useLanguage";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionsDialog({ open, onOpenChange }: QuestionsDialogProps) {
  const { t } = useLanguage();
  const { questions, loading, error } = useGeneralQuestions(open);
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
      {error ? (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            value={answers[question.id] || []}
            onValueChange={(value, checked) => handleAnswerChange(question.id, value, checked as boolean)}
            options={getQuestionOptions()}
          />
        ))
      )}
    </QuestionsDialogLayout>
  );
}
