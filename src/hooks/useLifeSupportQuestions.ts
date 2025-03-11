
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export function useLifeSupportQuestions(isDialogOpen: boolean) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log(`[LifeSupport] Fetching questions in ${currentLanguage}...`);
        
        if (currentLanguage === 'en') {
          // For English, fetch from the English table
          const { data, error } = await supabase
            .from('questionnaire_life_support_en')
            .select('*')
            .order('display_order', { ascending: true });
          
          if (error) {
            console.error('[LifeSupport] Error fetching questions:', error);
            toast({
              title: "Error",
              description: "Unable to load questions. Please try again.",
              variant: "destructive",
            });
            return;
          }
          
          console.log('[LifeSupport] Questions loaded:', data?.length || 0, 'questions');
          if (data?.length > 0) {
            console.log('[LifeSupport] First question:', data[0]);
          } else {
            console.log('[LifeSupport] No questions found in questionnaire_life_support_en');
          }
          
          setQuestions(data || []);
        } else {
          // For French, fetch from the French table which has a different structure
          const { data, error } = await supabase
            .from('questionnaire_life_support_fr')
            .select('*')
            .order('question_order', { ascending: true });
          
          if (error) {
            console.error('[LifeSupport] Error fetching questions:', error);
            toast({
              title: "Erreur",
              description: "Impossible de charger les questions. Veuillez réessayer.",
              variant: "destructive",
            });
            return;
          }
          
          if (data?.length > 0) {
            console.log('[LifeSupport] Raw French questions loaded:', data.length, 'questions');
            console.log('[LifeSupport] Sample question:', data[0]);
          } else {
            console.log('[LifeSupport] No questions found in questionnaire_life_support_fr');
          }
          
          // Transform the French questions to match the expected format in the components
          const formattedData = data?.map(item => ({
            id: item.id.toString(), // Convert id to string to match other tables
            question: item.question_text,
            display_order: item.question_order,
            options: {
              yes: item.option_yes,
              no: item.option_no,
              unsure: item.option_unsure
            }
          })) || [];
          
          console.log('[LifeSupport] Formatted French questions:', formattedData.length, 'questions');
          if (formattedData.length > 0) {
            console.log('[LifeSupport] First formatted question:', formattedData[0]);
          }
          
          setQuestions(formattedData);
        }
      } catch (error) {
        console.error('[LifeSupport] Unexpected error:', error);
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

    if (isDialogOpen) {
      setLoading(true);
      fetchQuestions();
    }
  }, [isDialogOpen, toast, currentLanguage]);

  return { questions, loading };
}
