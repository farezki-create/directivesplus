
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

  // Ajout de logs détaillés pour le débogage
  console.log("[LifeSupportDialog] État du dialogue:", open);
  console.log("[LifeSupportDialog] Nombre de questions:", questions.length);
  console.log("[LifeSupportDialog] Questions chargées:", JSON.stringify(questions));
  console.log("[LifeSupportDialog] État de chargement:", loading);
  console.log("[LifeSupportDialog] Langue actuelle:", currentLanguage);

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
        questions.map((question) => {
          console.log("Rendu de la question:", question);
          return (
            <QuestionWithExplanation
              key={question.id}
              question={question}
              value={answers[question.id] || []}
              onValueChange={(value) => handleAnswerChange(question.id, value, true)}
              options={getLifeSupportOptions()}
              language={currentLanguage as 'en' | 'fr'}
            />
          );
        })
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
