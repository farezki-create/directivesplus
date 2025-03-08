
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export function useAdvancedIllnessQuestions(open: boolean) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log(`[AdvancedIllness] Fetching questions in ${currentLanguage}...`);
        
        if (currentLanguage === 'en') {
          // Fetch English questions
          const { data, error } = await supabase
            .from('questionnaire_advanced_illness_en')
            .select('*')
            .order('display_order', { ascending: true });
          
          if (error) {
            console.error('[AdvancedIllness] Error fetching questions:', error);
            toast({
              title: "Error",
              description: "Unable to load questions. Please try again.",
              variant: "destructive",
            });
            return;
          }
          
          console.log('[AdvancedIllness] Questions loaded:', data?.length, 'questions');
          setQuestions(data || []);
        } else {
          // Fetch French questions
          const { data, error } = await supabase
            .from('questionnaire_advanced_illness_fr')
            .select('*')
            .order('display_order', { ascending: true });
          
          if (error) {
            console.error('[AdvancedIllness] Error fetching questions:', error);
            toast({
              title: "Erreur",
              description: "Impossible de charger les questions. Veuillez réessayer.",
              variant: "destructive",
            });
            return;
          }
          
          console.log('[AdvancedIllness] Questions loaded:', data?.length, 'questions');
          setQuestions(data || []);
        }
      } catch (error) {
        console.error('[AdvancedIllness] Unexpected error:', error);
        toast({
          title: "Erreur",
          description: "Une erreur inattendue s'est produite.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchQuestions();
    }
  }, [open, toast, currentLanguage]);

  return { questions, loading };
}
