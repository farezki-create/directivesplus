import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { QuestionsForm } from "./questions/QuestionsForm";
import { useQuestionnaireSubmission } from "@/hooks/useQuestionnaireSubmission";
import { useQuestionnaireAnswers } from "./questionnaire/useQuestionnaireAnswers";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionsDialog({ open, onOpenChange }: QuestionsDialogProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const { toast } = useToast();
  const { data: existingAnswers, isLoading: loadingAnswers } = useQuestionnaireAnswers("general_opinion");
  const { answers, isSubmitting, handleAnswerChange, handleSubmit } = useQuestionnaireSubmission('general_opinion');

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

  useEffect(() => {
    if (existingAnswers && existingAnswers.length > 0) {
      console.log('Chargement des réponses existantes:', existingAnswers);
      const answersMap: Record<string, string> = {};
      existingAnswers.forEach(answer => {
        if (answer.question_id) {
          answersMap[answer.question_id] = answer.answer;
        }
      });
      Object.entries(answersMap).forEach(([questionId, value]) => {
        handleAnswerChange(questionId, value);
      });
    }
  }, [existingAnswers]);

  const handleSubmitWrapper = async () => {
    if (!session?.user?.id) {
      console.log("Tentative de sauvegarde sans session utilisateur");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos réponses."
      });
      return;
    }

    console.log('Début de la soumission des réponses');
    try {
      await handleSubmit();
      console.log('Réponses soumises avec succès');
      toast({
        title: "Succès",
        description: "Vos réponses ont été enregistrées avec succès."
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la soumission des réponses:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de vos réponses."
      });
    }
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Mon avis d'une façon générale"
      onSubmit={handleSubmitWrapper}
      loading={loading || loadingAnswers}
      questionsLength={questions.length}
      isSubmitting={isSubmitting}
    >
      <QuestionsForm
        questions={questions}
        answers={answers}
        onAnswerChange={handleAnswerChange}
      />
    </QuestionsDialogLayout>
  );
}