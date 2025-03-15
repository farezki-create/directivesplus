
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export function useQuestionnairesResponses(userId: string | undefined) {
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const {
    data: responses,
    isLoading: responsesLoading,
    error: responsesError
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
    isLoading: synthesisLoading,
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
      if (data) {
        console.log("[Responses] Synthesis text:", data.free_text ? 
          `Present (length: ${data.free_text.length})` : "Not present");
        if (data.free_text) {
          console.log("[Responses] Synthesis text sample:", 
            data.free_text.substring(0, 50) + (data.free_text.length > 50 ? "..." : ""));
        }
      }
      
      return data;
    },
    enabled: !!userId,
  });

  // Handle errors by displaying a notification toast
  if (responsesError || synthesisError) {
    console.error("[Responses] Error in useQuestionnairesResponses:", responsesError || synthesisError);
    toast({
      title: currentLanguage === 'en' ? "Error retrieving responses" : "Erreur lors de la récupération des réponses",
      description: currentLanguage === 'en' 
        ? "An error occurred while retrieving your responses. Please try again." 
        : "Une erreur est survenue lors de la récupération de vos réponses. Veuillez réessayer.",
      variant: "destructive",
    });
  }

  // Combine responses and synthesis
  const combinedData = {
    ...responses || {
      general: [],
      lifeSupport: [],
      advancedIllness: [],
      preferences: [],
    },
    synthesis: synthesis || null
  };

  console.log("[Responses] Final combined data:", {
    hasResponses: !!responses,
    hasSynthesis: !!synthesis,
    synthesisTextLength: synthesis?.free_text?.length || 0,
    synthesisTextSample: synthesis?.free_text ? 
      synthesis.free_text.substring(0, 30) + (synthesis.free_text.length > 30 ? '...' : '') : 
      'None'
  });

  return {
    responses: combinedData,
    synthesis,
    isLoading: responsesLoading || synthesisLoading,
    hasErrors: !!responsesError || !!synthesisError,
  };
}
