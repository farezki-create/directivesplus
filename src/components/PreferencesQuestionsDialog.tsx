import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";

interface PreferencesQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreferencesQuestionsDialog({
  open,
  onOpenChange,
}: PreferencesQuestionsDialogProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const { data: questions, isLoading } = useQuery({
    queryKey: ["preferences-questions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("preferences_questions")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching preferences questions:", error);
        throw error;
      }
      return data;
    },
  });

  const handleSubmit = () => {
    console.log("Submitting answers:", answers);
    onOpenChange(false);
    setCurrentStep(0);
    setAnswers({});
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Mes goûts et mes peurs"
      onSubmit={handleSubmit}
      loading={isLoading}
      questionsLength={questions?.length || 0}
    >
      {questions?.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || ''}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          options={[
            { label: "Oui", value: "oui" },
            { label: "Non", value: "non" },
            { label: "Je ne sais pas", value: "indecis" }
          ]}
        />
      ))}
    </QuestionsDialogLayout>
  );
}