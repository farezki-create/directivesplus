
import React from "react";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useAdvancedIllnessQuestionsDialog } from "@/hooks/advanced-illness/useAdvancedIllnessQuestionsDialog";
import { useAdvancedIllnessSubmit } from "@/hooks/advanced-illness/useAdvancedIllnessSubmit";
import { AdvancedIllnessQuestionsList } from "./advanced-illness/AdvancedIllnessQuestionsList";

interface AdvancedIllnessQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedIllnessQuestionsDialog({ 
  open, 
  onOpenChange 
}: AdvancedIllnessQuestionsDialogProps) {
  const { questions, loading, answers, handleAnswerChange, t } = useAdvancedIllnessQuestionsDialog(open);
  const { submitAnswers } = useAdvancedIllnessSubmit();

  const handleSubmit = async () => {
    const success = await submitAnswers(answers, questions);
    if (success) {
      onOpenChange(false);
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
      <AdvancedIllnessQuestionsList
        questions={questions}
        answers={answers}
        onValueChange={handleAnswerChange}
      />
    </QuestionsDialogLayout>
  );
}
