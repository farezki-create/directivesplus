
import { QuestionWithExplanation } from "./questions/QuestionWithExplanation";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useLanguage } from "@/hooks/useLanguage";
import { useAdvancedIllnessQuestions } from "@/hooks/useAdvancedIllnessQuestions";
import { useAdvancedIllnessResponses } from "@/hooks/useAdvancedIllnessResponses";
import { useQuestionOptions } from "./questions/QuestionOptions";

interface AdvancedIllnessQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedIllnessQuestionsDialog({ 
  open, 
  onOpenChange 
}: AdvancedIllnessQuestionsDialogProps) {
  const { t, currentLanguage } = useLanguage();
  const { questions, loading } = useAdvancedIllnessQuestions(open);
  const { answers, handleAnswerChange, handleSubmit } = useAdvancedIllnessResponses(questions);
  const { getAdvancedIllnessOptions } = useQuestionOptions();

  // Debug logs
  console.log("AdvancedIllnessQuestionsDialog - questions count:", questions.length);
  console.log("AdvancedIllnessQuestionsDialog - language:", currentLanguage);
  if (questions.length > 0) {
    console.log("First question explanation:", questions[0].explanation || "No direct explanation");
    questions.forEach((q, i) => {
      console.log(`Dialog Question ${i+1}: ID=${q.id}, explanation length: ${q.explanation?.length || 0}`);
    });
  }

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
      title={t('advancedIllnessTitle')}
      description={t('advancedIllnessDesc')}
      onSubmit={onSubmit}
      loading={loading}
      questionsLength={questions.length}
    >
      {questions.map((question, index) => {
        // Ensure we have all necessary properties standardized
        const enhancedQuestion = {
          ...question,
          display_order: question.display_order || index + 1,
          display_order_str: question.display_order_str || (index + 1).toString(),
          question: question.question || question.question_text,
          question_text: question.question_text || question.question,
          explanation: question.explanation || '',
          questionnaire_type: 'advanced_illness'
        };
        
        console.log(`[Dialog] Rendering question ${index+1}: ID=${question.id}, explanation length: ${enhancedQuestion.explanation?.length || 0}`);
        
        return (
          <QuestionWithExplanation
            key={question.id}
            question={enhancedQuestion}
            value={answers[question.id] || []}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
            options={getAdvancedIllnessOptions()}
            language={currentLanguage as 'en' | 'fr'}
          />
        );
      })}
    </QuestionsDialogLayout>
  );
}
