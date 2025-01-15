import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { QuestionsForm } from "./questions/QuestionsForm";
import { useQuestionnaireSubmission } from "@/hooks/useQuestionnaireSubmission";

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionsDialog({ open, onOpenChange }: QuestionsDialogProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { answers, handleAnswerChange, handleSubmit } = useQuestionnaireSubmission();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log("Fetching general opinion questions...");
        const { data, error } = await supabase
          .from('questions')
          .select('*');
        
        if (error) {
          console.error('Error fetching questions:', error);
          return;
        }
        
        console.log('Raw data from questions table:', data);
        setQuestions(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchQuestions();
    }
  }, [open]);

  const handleSubmitWrapper = async () => {
    await handleSubmit(() => {
      console.log("Closing dialog after successful submission");
      onOpenChange(false);
    });
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Mon avis d'une façon générale"
      onSubmit={handleSubmitWrapper}
      loading={loading}
      questionsLength={questions.length}
    >
      <QuestionsForm
        questions={questions}
        answers={answers}
        onAnswerChange={handleAnswerChange}
      />
    </QuestionsDialogLayout>
  );
}