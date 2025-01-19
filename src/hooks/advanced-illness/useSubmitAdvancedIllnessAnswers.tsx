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

      // Delete existing responses first
      console.log("[AdvancedIllness] Deleting existing responses");
      const { error: deleteError } = await supabase
        .from("questionnaire_advanced_illness_responses")
        .delete()
        .eq("user_id", userId);

      if (deleteError) {
        console.error("[AdvancedIllness] Error deleting existing responses:", deleteError);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour vos réponses.",
          variant: "destructive",
        });
        return false;
      }

      // Insert new responses
      console.log("[AdvancedIllness] Inserting new responses:", responses.length);
      for (const response of responses) {
        const { error: insertError } = await supabase
          .from("questionnaire_advanced_illness_responses")
          .insert(response);

        if (insertError) {
          console.error("[AdvancedIllness] Error inserting response:", insertError);
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