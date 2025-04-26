
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
        
        // Explicitly request all fields, especially explanation
        const { data, error } = await supabase
          .from(tableName)
          .select('id, display_order, question, explanation, created_at')
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
        
        // Log the raw data from database to check explanations
        console.log('[AdvancedIllness] Raw data from database:', data);
        
        // Add position index (1-based) as display_order_str to each question
        const processedData = data?.map((q, index) => ({
          ...q,
          // Use existing display_order if available, otherwise use 1-based index
          display_order_str: q.display_order ? q.display_order.toString() : (index + 1).toString(),
          // Ensure explanation is preserved
          explanation: q.explanation || ''
        })) || [];
        
        // Debug log explanations
        processedData.forEach((q, i) => {
          console.log(`[AdvancedIllness] Question ${i+1}: ID=${q.id}, explanation present: ${!!q.explanation}, length: ${q.explanation?.length || 0}`);
          if (q.explanation) {
            console.log(`[AdvancedIllness] Sample explanation: ${q.explanation.substring(0, 50)}...`);
          }
        });
        
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
