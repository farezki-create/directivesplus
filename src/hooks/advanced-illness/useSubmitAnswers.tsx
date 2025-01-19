import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSubmitAnswers() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (
    answers: Record<string, string[]>,
    questions: any[],
    onOpenChange: (open: boolean) => void
  ) => {
    if (isSubmitting) {
      console.log('[AdvancedIllness] Submission already in progress');
      return;
    }

    try {
      setIsSubmitting(true);
      console.log('[AdvancedIllness] Submitting answers:', answers);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error('[AdvancedIllness] No user ID found');
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer vos réponses.",
          variant: "destructive",
        });
        return;
      }

      // First, delete existing responses for this user
      const { error: deleteError } = await supabase
        .from('questionnaire_advanced_illness_responses')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('[AdvancedIllness] Error deleting existing responses:', deleteError);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour vos réponses. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      // Prepare all responses for insertion
      const responses = Object.entries(answers).flatMap(([questionId, values]) => {
        const question = questions.find(q => q.id === questionId);
        return values.map(value => ({
          user_id: userId,
          question_id: questionId,
          question_text: question?.question,
          response: value
        }));
      });

      console.log('[AdvancedIllness] Prepared responses for insertion:', responses);

      if (responses.length === 0) {
        console.log('[AdvancedIllness] No responses to insert');
        toast({
          title: "Succès",
          description: "Vos réponses ont été enregistrées.",
        });
        onOpenChange(false);
        return;
      }

      // Insert new responses
      const { error: insertError } = await supabase
        .from('questionnaire_advanced_illness_responses')
        .insert(responses);

      if (insertError) {
        console.error('[AdvancedIllness] Error saving responses:', insertError);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer vos réponses. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      console.log('[AdvancedIllness] Responses saved successfully');
      toast({
        title: "Succès",
        description: "Vos réponses ont été enregistrées.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('[AdvancedIllness] Unexpected error during submission:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
}