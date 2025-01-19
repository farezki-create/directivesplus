import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useAdvancedIllnessQuestions } from "@/hooks/useAdvancedIllnessQuestions";
import { useAdvancedIllnessResponses } from "@/hooks/useAdvancedIllnessResponses";

interface AdvancedIllnessQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedIllnessQuestionsDialog({ 
  open, 
  onOpenChange 
}: AdvancedIllnessQuestionsDialogProps) {
  const { questions, loading } = useAdvancedIllnessQuestions(open);
  const { answers, handleAnswerChange, handleSubmit } = useAdvancedIllnessResponses(open);

  const getQuestionOptions = (question: any) => [
    { value: 'oui', label: question.oui },
    { value: 'non', label: question.non },
    { 
      value: 'oui_medical', 
      label: question["Oui si l'équipe médicale le juge utile"]
    },
    { 
      value: 'oui_confiance', 
      label: question["Oui si ma personne de confiance le juge utile"]
    }
  ];

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Maladie avancée"
      description="Répondez aux questions suivantes concernant vos souhaits en cas de maladie avancée."
      onSubmit={() => handleSubmit(questions, onOpenChange)}
      loading={loading}
      questionsLength={questions.length}
    >
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value, checked) => handleAnswerChange(question.id, value, checked)}
          options={getQuestionOptions(question)}
          multiple={true}
        />
      ))}
    </QuestionsDialogLayout>
  );
}