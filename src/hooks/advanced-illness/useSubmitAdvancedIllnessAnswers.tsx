import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useSubmitAdvancedIllnessAnswers() {
  const { toast } = useToast();

  const submitAnswers = async (answers: Record<string, string[]>, questions: any[]) => {
    try {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error("[AdvancedIllness] No user ID found for submission");
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer vos réponses.",
          variant: "destructive",
        });
        return false;
      }

      console.log("[AdvancedIllness] Preparing responses for submission");
      const responses = Object.entries(answers).map(([questionId, response]) => {
        const question = questions.find((q) => q.id === questionId);
        return {
          user_id: userId,
          question_id: questionId,
          response: JSON.stringify(response),
          question_text: question?.question || "",
        };
      });

      if (responses.length === 0) {
        console.log("[AdvancedIllness] No responses to submit");
        return true;
      }

      console.log("[AdvancedIllness] Upserting responses:", responses.length);
      for (const response of responses) {
        const { error: upsertError } = await supabase
          .from("questionnaire_advanced_illness_responses")
          .upsert(response, {
            onConflict: 'user_id,question_id',
            ignoreDuplicates: false
          });

        if (upsertError) {
          console.error("[AdvancedIllness] Error upserting response:", upsertError);
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de l'enregistrement.",
            variant: "destructive",
          });
          return false;
        }
      }

      console.log("[AdvancedIllness] All responses submitted successfully");
      toast({
        title: "Succès",
        description: "Vos réponses ont été enregistrées.",
      });
      return true;
    } catch (error) {
      console.error("[AdvancedIllness] Unexpected error during submission:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { submitAnswers };
}