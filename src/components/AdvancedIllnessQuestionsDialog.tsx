import { useEffect } from "react";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useQuestionnaireAnswers } from "./questionnaire/useQuestionnaireAnswers";
import { useQuestionnaireState } from "@/hooks/useQuestionnaireState";

interface AdvancedIllnessQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedIllnessQuestionsDialog({ 
  open, 
  onOpenChange 
}: AdvancedIllnessQuestionsDialogProps) {
  const { data: existingAnswers, isLoading: loadingAnswers } = useQuestionnaireAnswers("advanced_illness");
  const {
    questions,
    loading,
    answers,
    fetchQuestions,
    handleAnswerChange,
    handleSubmit,
    loadExistingAnswers
  } = useQuestionnaireState("advanced_illness");

  useEffect(() => {
    if (open) {
      fetchQuestions();
    }
  }, [open]);

  useEffect(() => {
    loadExistingAnswers(existingAnswers);
  }, [existingAnswers]);

  const getQuestionOptions = (question: any) => [
    { 
      value: 'oui_medical', 
      label: question["Oui si l'équipe médicale le juge utile"]
    },
    { 
      value: 'oui_confiance', 
      label: question["Oui si ma personne de confiance le juge utile"]
    },
    { value: 'oui', label: question.oui },
    { value: 'non', label: question.non }
  ];

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Maladie avancée"
      onSubmit={() => handleSubmit(() => onOpenChange(false))}
      loading={loading || loadingAnswers}
      questionsLength={questions.length}
    >
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || ''}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          options={getQuestionOptions(question)}
        />
      ))}
    </QuestionsDialogLayout>
  );
}