
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useLanguage } from "@/hooks/language/useLanguage";
import { useLifeSupportQuestions } from "@/hooks/life-support/useLifeSupportQuestions";
import { useLifeSupportAnswers } from "@/hooks/life-support/useLifeSupportAnswers";
import { LifeSupportQuestionsList } from "./life-support/LifeSupportQuestionsList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface LifeSupportQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LifeSupportQuestionsDialog({ 
  open, 
  onOpenChange 
}: LifeSupportQuestionsDialogProps) {
  const { t } = useLanguage();
  const { questions, loading, error } = useLifeSupportQuestions(open);
  const { answers, handleAnswerChange, handleSubmit } = useLifeSupportAnswers(
    questions, 
    () => onOpenChange(false)
  );

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('lifeSupport')}
      description={t('lifeSupportDesc')}
      onSubmit={handleSubmit}
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
        <LifeSupportQuestionsList
          questions={questions}
          answers={answers}
          onValueChange={handleAnswerChange}
        />
      )}
    </QuestionsDialogLayout>
  );
}
