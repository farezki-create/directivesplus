import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useFetchAdvancedIllnessAnswers(open: boolean) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const fetchExistingAnswers = async () => {
    try {
      // Reset answers before fetching to avoid showing stale data
      setAnswers({});
      
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      
      if (!userId) {
        console.error("[AdvancedIllness] No user ID found");
        return;
      }

      console.log("[AdvancedIllness] Fetching existing answers for user:", userId);
      const { data: existingAnswers, error } = await supabase
        .from("questionnaire_advanced_illness_responses")
        .select("question_id, response")
        .eq("user_id", userId);

      if (error) {
        console.error("[AdvancedIllness] Error fetching existing answers:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger vos réponses existantes.",
          variant: "destructive",
        });
        return;
      }

      console.log("[AdvancedIllness] Found existing answers:", existingAnswers?.length);
      const answersMap: Record<string, string> = {};
      existingAnswers?.forEach((answer) => {
        answersMap[answer.question_id] = answer.response;
      });
      setAnswers(answersMap);
    } catch (error) {
      console.error("[AdvancedIllness] Unexpected error fetching answers:", error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (open) {
      fetchExistingAnswers();
    } else {
      // Reset answers when dialog closes
      setAnswers({});
    }
  }, [open]);

  return { answers, setAnswers };
}