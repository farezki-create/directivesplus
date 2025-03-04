
import { useQuestionsData } from "@/hooks/useQuestionsData";
import { useQuestionSubmit } from "@/hooks/useQuestionSubmit";
import { useQuestionOptions } from "@/utils/questionOptions";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { QuestionsList } from "./questions/QuestionsList";
import { useLanguage } from "@/hooks/useLanguage";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionsDialog({ open, onOpenChange }: QuestionsDialogProps) {
  const { t, currentLanguage } = useLanguage();
  const { questions, loading, answers, setAnswers } = useQuestionsData(open);
  const handleSubmit = useQuestionSubmit(questions, currentLanguage);
  const { getQuestionOptions } = useQuestionOptions();

  const handleAnswerChange = (questionId: string, value: string, checked: boolean) => {
    console.log(`[QuestionsDialog] Answer change for question ${questionId}: ${value}, checked: ${checked}`);
    
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      
      if (checked) {
        // Add the value if it's not already in the array
        if (!currentAnswers.includes(value)) {
          return {
            ...prev,
            [questionId]: [...currentAnswers, value]
          };
        }
      } else {
        // Remove the value if checked is false
        return {
          ...prev,
          [questionId]: currentAnswers.filter(v => v !== value)
        };
      }
      
      return prev;
    });
  };

  const onSubmit = () => {
    console.log('[QuestionsDialog] Submitting answers:', answers);
    handleSubmit(answers, () => onOpenChange(false));
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('generalOpinion')}
      description={t('generalOpinionDesc')}
      onSubmit={onSubmit}
      loading={loading}
      questionsLength={questions.length}
    >
      {!loading && questions.length > 0 && (
        <ScrollArea className="flex-1 px-1">
          <QuestionsList
            questions={questions}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            options={getQuestionOptions()}
          />
        </ScrollArea>
      )}
    </QuestionsDialogLayout>
  );
}
