
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/language/useLanguage";

export function useGeneralQuestions(open: boolean) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    async function fetchQuestions() {
      if (!open) return; // Only fetch when dialog is open
      
      setLoading(true);
      setError(null);
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
          setError(error.message);
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
        if (data?.length === 0) {
          console.log('[GeneralOpinion] No questions found in database');
          setError(currentLanguage === 'fr' 
            ? "Aucune question n'a été trouvée dans la base de données." 
            : "No questions were found in the database.");
        }
        setQuestions(data || []);
      } catch (error) {
        console.error('[GeneralOpinion] Unexpected error:', error);
        setError((error as Error).message);
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

  return { questions, loading, error };
}
