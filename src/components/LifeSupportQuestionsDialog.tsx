
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
  console.log("[LifeSupportDialog] Questions count:", questions?.length || 0);
  console.log("[LifeSupportDialog] Current language:", currentLanguage);
  console.log("[LifeSupportDialog] Loading state:", loading);
  
  if (questions?.length > 0) {
    console.log("[LifeSupportDialog] First question sample:", JSON.stringify(questions[0], null, 2));
  } else {
    console.log("[LifeSupportDialog] No questions available");
  }
  
  // Get appropriate options for the current language
  const options = getLifeSupportOptions();
  console.log("[LifeSupportDialog] Options:", options);

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
      questionsLength={questions?.length || 0}
    >
      {questions && questions.length > 0 ? (
        questions.map((question) => {
          console.log(`Rendering question:`, question);
          if (!question || !question.id) {
            console.error("Invalid question object:", question);
            return null;
          }
          return (
            <QuestionWithExplanation
              key={question.id}
              question={question}
              value={answers[question.id] || []}
              onValueChange={(value) => handleAnswerChange(question.id, value, true)}
              options={options}
              language={currentLanguage as 'en' | 'fr'}
            />
          );
        })
      ) : !loading ? (
        <div className="text-center py-4 text-muted-foreground">
          {currentLanguage === 'en' 
            ? "No questions available. Please try again later." 
            : "Aucune question disponible. Veuillez réessayer plus tard."}
        </div>
      ) : null}
    </QuestionsDialogLayout>
  );
}
