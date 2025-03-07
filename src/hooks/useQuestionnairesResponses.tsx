
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/language/useLanguage";

export function useQuestionnairesResponses(userId: string | undefined) {
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const {
    data: responses,
    isLoading,
    error
  } = useQuery({
    queryKey: ["questionnaire-responses", userId],
    queryFn: async () => {
      console.log("[Responses] Fetching all questionnaire responses for user:", userId);
      const { data, error } = await supabase
        .from("questionnaire_responses")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("[Responses] Error fetching questionnaire responses:", error);
        throw error;
      }
      console.log("[Responses] Retrieved responses:", data?.length);
      return data;
    },
    enabled: !!userId,
  });

  // Process responses into categories
  const processedResponses = {
    general: responses?.filter(r => r.questionnaire_type === 'general') || [],
    lifeSupport: responses?.filter(r => r.questionnaire_type === 'life_support') || [],
    advancedIllness: responses?.filter(r => r.questionnaire_type === 'advanced_illness') || [],
    preferences: responses?.filter(r => r.questionnaire_type === 'preferences') || [],
  };

  // Fetch synthesis separately (not part of the unified table)
  const {
    data: synthesis,
    isLoading: isLoadingSynthesis,
    error: synthesisError
  } = useQuery({
    queryKey: ["synthesis", userId],
    queryFn: async () => {
      console.log("[Responses] Fetching synthesis for user:", userId);
      const { data, error } = await supabase
        .from("questionnaire_synthesis")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("[Responses] Error fetching synthesis:", error);
        throw error;
      }
      console.log("[Responses] Retrieved synthesis:", data ? "yes" : "no");
      return data;
    },
    enabled: !!userId,
  });

  // Handle errors with toast notification
  if (error || synthesisError) {
    console.error("[Responses] Error in useQuestionnairesResponses:", error || synthesisError);
    toast({
      title: currentLanguage === 'en' ? "Error retrieving responses" : "Erreur lors de la récupération des réponses",
      description: currentLanguage === 'en' 
        ? "An error occurred while retrieving your responses. Please try again." 
        : "Une erreur est survenue lors de la récupération de vos réponses. Veuillez réessayer.",
      variant: "destructive",
    });
  }

  return {
    responses: {
      ...processedResponses,
      synthesis: synthesis,
    },
    isLoading: isLoading || isLoadingSynthesis,
    hasErrors: !!error || !!synthesisError,
  };
}
