
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
        
        const tableName = currentLanguage === 'en' 
          ? 'questionnaire_advanced_illness_en' 
          : 'questionnaire_advanced_illness_fr';
        
        console.log(`[AdvancedIllness] Using table: ${tableName}`);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('display_order', { ascending: true });
        
        if (error) {
          console.error('[AdvancedIllness] Error fetching questions:', error);
          toast({
            title: currentLanguage === 'en' ? "Error" : "Erreur",
            description: currentLanguage === 'en' 
              ? "Unable to load questions. Please try again." 
              : "Impossible de charger les questions. Veuillez réessayer.",
            variant: "destructive",
          });
          return;
        }
        
        // Add position index (1-based) as display_order_str to each question
        // This will help match questions with explanations when display_order is null
        const processedData = data?.map((q, index) => ({
          ...q,
          // Use existing display_order if available, otherwise use 1-based index
          display_order_str: q.display_order ? q.display_order.toString() : (index + 1).toString()
        })) || [];
        
        console.log('[AdvancedIllness] Processed questions:', processedData);
        setQuestions(processedData);
      } catch (error) {
        console.error('[AdvancedIllness] Unexpected error:', error);
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
