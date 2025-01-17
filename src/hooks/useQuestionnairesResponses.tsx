import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useQuestionnairesResponses(userId: string | undefined) {
  const { toast } = useToast();

  const {
    data: generalResponses,
    isLoading: isLoadingGeneral,
    error: generalError
  } = useQuery({
    queryKey: ["general-responses", userId],
    queryFn: async () => {
      console.log("[Responses] Fetching general responses for user:", userId);
      const { data, error } = await supabase
        .from("questionnaire_general_responses")
        .select("*, questions(*)")
        .eq("user_id", userId);

      if (error) {
        console.error("[Responses] Error fetching general responses:", error);
        throw error;
      }
      console.log("[Responses] Found general responses:", data?.length);
      return data;
    },
    enabled: !!userId,
  });

  const {
    data: lifeSupportResponses,
    isLoading: isLoadingLifeSupport,
    error: lifeSupportError
  } = useQuery({
    queryKey: ["life-support-responses", userId],
    queryFn: async () => {
      console.log("[Responses] Fetching life support responses for user:", userId);
      const { data, error } = await supabase
        .from("questionnaire_life_support_responses")
        .select("*, life_support_questions(*)")
        .eq("user_id", userId);

      if (error) {
        console.error("[Responses] Error fetching life support responses:", error);
        throw error;
      }
      console.log("[Responses] Found life support responses:", data?.length);
      return data;
    },
    enabled: !!userId,
  });

  const {
    data: advancedIllnessResponses,
    isLoading: isLoadingAdvancedIllness,
    error: advancedIllnessError
  } = useQuery({
    queryKey: ["advanced-illness-responses", userId],
    queryFn: async () => {
      console.log("[Responses] Fetching advanced illness responses for user:", userId);
      const { data, error } = await supabase
        .from("questionnaire_advanced_illness_responses")
        .select("*, advanced_illness_questions(*)")
        .eq("user_id", userId);

      if (error) {
        console.error("[Responses] Error fetching advanced illness responses:", error);
        throw error;
      }
      console.log("[Responses] Found advanced illness responses:", data?.length);
      return data;
    },
    enabled: !!userId,
  });

  const {
    data: preferencesResponses,
    isLoading: isLoadingPreferences,
    error: preferencesError
  } = useQuery({
    queryKey: ["preferences-responses", userId],
    queryFn: async () => {
      console.log("[Responses] Fetching preferences responses for user:", userId);
      const { data, error } = await supabase
        .from("questionnaire_preferences_responses")
        .select("*, preferences_questions(*)")
        .eq("user_id", userId);

      if (error) {
        console.error("[Responses] Error fetching preferences responses:", error);
        throw error;
      }
      console.log("[Responses] Found preferences responses:", data?.length);
      return data;
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
      console.log("[Responses] Found synthesis:", data ? "yes" : "no");
      return data;
    },
    enabled: !!userId,
  });

  // Handle any errors by showing a toast notification
  const errors = [generalError, lifeSupportError, advancedIllnessError, preferencesError, synthesisError];
  errors.forEach(error => {
    if (error) {
      console.error("[Responses] Error:", error);
      toast({
        title: "Erreur lors de la récupération des réponses",
        description: "Une erreur est survenue lors de la récupération de vos réponses. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  });

  return {
    responses: {
      general: generalResponses,
      lifeSupport: lifeSupportResponses,
      advancedIllness: advancedIllnessResponses,
      preferences: preferencesResponses,
      synthesis: synthesis,
    },
    isLoading: 
      isLoadingGeneral || 
      isLoadingLifeSupport || 
      isLoadingAdvancedIllness || 
      isLoadingPreferences || 
      isLoadingSynthesis,
    hasErrors: errors.some(error => error !== null),
  };
}