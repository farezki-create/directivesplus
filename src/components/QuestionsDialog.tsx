
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
  const { questions, loading, answers, handleAnswerChange } = useQuestionsData(open);
  const handleSubmit = useQuestionSubmit(questions, currentLanguage);
  const { getQuestionOptions } = useQuestionOptions();

  const onSubmit = () => {
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
