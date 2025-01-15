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

  const handleNext = () => {
    if (questions && currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onOpenChange(false);
      setCurrentStep(0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Mes goûts et mes peurs</DialogTitle>
          <DialogDescription>
            Répondez aux questions suivantes pour nous aider à mieux comprendre vos préférences.
          </DialogDescription>
        </DialogHeader>

        {questions && questions[currentStep] && (
          <QuestionCard
            question={questions[currentStep].question}
            value={answers[questions[currentStep].id] || ''}
            onValueChange={(value) => handleAnswerChange(questions[currentStep].id, value)}
            options={[
              { label: "Oui", value: "oui" },
              { label: "Non", value: "non" },
              { label: "Je ne sais pas", value: "indecis" }
            ]}
          />
        )}

        <DialogFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Précédent
          </Button>
          <Button onClick={handleNext}>
            {questions && currentStep === questions.length - 1
              ? "Terminer"
              : "Suivant"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}