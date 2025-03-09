
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export function usePreferencesQuestions(open: boolean) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log(`[Preferences] Fetching questions in ${currentLanguage}...`);
        
        // Determine which table to query based on language
        const tableName = currentLanguage === 'en' 
          ? 'questionnaire_preferences_en' 
          : 'questionnaire_preferences_fr';
        
        console.log(`[Preferences] Using table: ${tableName}`);
        
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .order("display_order", { ascending: true });

        if (error) {
          console.error("[Preferences] Error fetching questions:", error);
          toast({
            title: currentLanguage === 'en' ? "Error" : "Erreur",
            description: currentLanguage === 'en' 
              ? "Unable to load questions. Please try again." 
              : "Impossible de charger les questions. Veuillez réessayer.",
            variant: "destructive",
          });
          return;
        }
        console.log('[Preferences] Questions loaded:', data?.length, 'questions');
        setQuestions(data || []);
      } catch (error) {
        console.error("[Preferences] Unexpected error:", error);
        toast({
          title: currentLanguage === 'en' ? "Error" : "Erreur",
          description: currentLanguage === 'en' 
            ? "An unexpected error occurred." 
            : "Une erreur inattendue s'est produite.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchQuestions();
      setLoading(true);
    }
  }, [open, toast, currentLanguage]);

  return { questions, loading };
}
