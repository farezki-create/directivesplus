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
  const { answers, handleAnswerChange, handleSubmit } = useQuestionnaireSubmission('general_opinion');

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log("Chargement des questions d'opinion générale...");
        const { data, error } = await supabase
          .from('questions')
          .select('*')
          .order('order', { ascending: true });
        
        if (error) {
          console.error('Erreur lors du chargement des questions:', error);
          return;
        }
        
        console.log('Questions chargées:', data);
        setQuestions(data || []);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchQuestions();
    }
  }, [open]);

  const handleSubmitWrapper = async () => {
    console.log('Début de la soumission des réponses');
    await handleSubmit(() => {
      console.log('Fermeture de la boîte de dialogue');
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