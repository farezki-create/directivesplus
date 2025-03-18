
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
  
  // Get appropriate options for the current language
  const options = getLifeSupportOptions();

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
          if (!question || !question.id) {
            console.error("Invalid question object:", question);
            return null;
          }
          
          // Force strong life support identification with multiple signals
          const enhancedQuestion = {
            ...question,
            // For French questions, make sure both question and question_text are available
            question: question.question || question.question_text,
            question_text: question.question_text || question.question,
            // Explicitly mark as life support question
            isLifeSupportQuestion: true,
            // Add type indicator to help with detection
            questionType: 'life_support'
          };
          
          console.log(`Rendering LIFE SUPPORT question: ${enhancedQuestion.id} - "${enhancedQuestion.question?.substring(0, 30) || 'No question text'}..."`);
          
          return (
            <QuestionWithExplanation
              key={question.id}
              question={enhancedQuestion}
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
