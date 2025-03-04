
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAdvancedIllnessSubmit() {
  const { toast } = useToast();

  const submitAnswers = async (answers: Record<string, string[]>, questions: any[]) => {
    try {
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
        return false;
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

      const { error } = await supabase
        .from('questionnaire_advanced_illness_responses')
        .upsert(responses, {
          onConflict: 'user_id,question_id,response'
        });

      if (error) {
        console.error('[AdvancedIllness] Error saving responses:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer vos réponses. Veuillez réessayer.",
          variant: "destructive",
        });
        return false;
      }

      console.log('[AdvancedIllness] Responses saved successfully');
      toast({
        title: "Succès",
        description: "Vos réponses ont été enregistrées.",
      });
      return true;
    } catch (error) {
      console.error('[AdvancedIllness] Unexpected error during submission:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { submitAnswers };
}
