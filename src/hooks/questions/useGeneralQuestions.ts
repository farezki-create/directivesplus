
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/language/useLanguage";

export function useGeneralQuestions(open: boolean) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    async function fetchQuestions() {
      if (!open) return; // Only fetch when dialog is open
      
      setLoading(true);
      try {
        console.log(`[GeneralOpinion] Loading general opinion questions from database in ${currentLanguage}...`);
        
        let data, error;
        
        if (currentLanguage === 'en') {
          // Fetch English questions
          const result = await supabase
            .from('questions_en')
            .select('*')
            .eq('category', 'general_opinion')
            .order('display_order', { ascending: true });
          
          data = result.data;
          error = result.error;
        } else {
          // Fetch French questions
          const result = await supabase
            .from('questions')
            .select('*')
            .eq('category', 'general_opinion')
            .order('display_order', { ascending: true });
          
          data = result.data;
          error = result.error;
        }
        
        if (error) {
          console.error('[GeneralOpinion] Error fetching questions:', error);
          toast({
            title: currentLanguage === 'fr' ? "Erreur" : "Error",
            description: currentLanguage === 'fr' 
              ? "Impossible de charger les questions. Veuillez réessayer." 
              : "Unable to load questions. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        console.log('[GeneralOpinion] Questions loaded:', data?.length, 'questions');
        setQuestions(data || []);
      } catch (error) {
        console.error('[GeneralOpinion] Unexpected error:', error);
        toast({
          title: currentLanguage === 'fr' ? "Erreur" : "Error",
          description: currentLanguage === 'fr'
            ? "Une erreur inattendue s'est produite."
            : "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [open, toast, currentLanguage]);

  return { questions, loading };
}
