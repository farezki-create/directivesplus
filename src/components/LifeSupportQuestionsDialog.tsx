
import { QuestionWithExplanation } from "./questions/QuestionWithExplanation";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useLanguage } from "@/hooks/useLanguage";
import { useLifeSupportQuestions } from "@/hooks/useLifeSupportQuestions";
import { useLifeSupportAnswers } from "@/hooks/useLifeSupportAnswers";
import { useQuestionOptions } from "./questions/QuestionOptions";

interface LifeSupportQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LifeSupportQuestionsDialog({ 
  open, 
  onOpenChange 
}: LifeSupportQuestionsDialogProps) {
  const { t, currentLanguage } = useLanguage();
  const { questions, loading } = useLifeSupportQuestions(open);
  const { answers, handleAnswerChange, handleSubmit } = useLifeSupportAnswers(questions);
  const { getLifeSupportOptions } = useQuestionOptions();

  // Detailed logging for debugging
  console.log("[LifeSupportDialog] Dialog state:", open);
  console.log("[LifeSupportDialog] Questions count:", questions.length);
  console.log("[LifeSupportDialog] Current language:", currentLanguage);
  console.log("[LifeSupportDialog] Loading state:", loading);
  
  // Log each question individually for better visibility
  questions.forEach((q, index) => {
    console.log(`[LifeSupportDialog] Question ${index + 1}:`, q);
  });

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
      title={t('lifeSupport')}
      description={t('advancedIllnessDesc')}
      onSubmit={onSubmit}
      loading={loading}
      questionsLength={questions.length}
    >
      {questions.length > 0 ? (
        questions.map((question) => (
          <QuestionWithExplanation
            key={question.id}
            question={question}
            value={answers[question.id] || []}
            onValueChange={(value) => handleAnswerChange(question.id, value, true)}
            options={getLifeSupportOptions()}
            language={currentLanguage as 'en' | 'fr'}
          />
        ))
      ) : !loading && (
        <div className="text-center py-4 text-muted-foreground">
          {currentLanguage === 'en' 
            ? "No questions available. Please try again later." 
            : "Aucune question disponible. Veuillez réessayer plus tard."}
        </div>
      )}
    </QuestionsDialogLayout>
  );
}
