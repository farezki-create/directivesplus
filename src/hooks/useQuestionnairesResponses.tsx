
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export function useQuestionnairesResponses(userId: string | undefined) {
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const {
    data: responses,
    isLoading,
    error
  } = useQuery({
    queryKey: ["questionnaire-responses", userId, currentLanguage],
    queryFn: async () => {
      console.log("[Responses] Fetching all responses for user:", userId);
      const { data, error } = await supabase
        .from("questionnaire_responses")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        console.error("[Responses] Error fetching responses:", error);
        throw error;
      }
      console.log("[Responses] Retrieved responses:", data?.length);
      
      // Group responses by questionnaire type
      const grouped = {
        general: data?.filter(r => r.questionnaire_type === 'general_opinion') || [],
        lifeSupport: data?.filter(r => r.questionnaire_type === 'life_support') || [],
        advancedIllness: data?.filter(r => r.questionnaire_type === 'advanced_illness') || [],
        preferences: data?.filter(r => r.questionnaire_type === 'preferences') || [],
      };
      
      return grouped;
    },
    enabled: !!userId,
  });

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

  // Handle errors by displaying a notification toast
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
    responses: responses || {
      general: [],
      lifeSupport: [],
      advancedIllness: [],
      preferences: [],
    },
    synthesis,
    isLoading: isLoading || isLoadingSynthesis,
    hasErrors: !!error || !!synthesisError,
  };
}
