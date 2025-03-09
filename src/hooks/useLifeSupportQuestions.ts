
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
          
          console.log('[LifeSupport] Questions loaded:', data?.length, 'questions');
          console.log('[LifeSupport] Questions order:', data?.map(q => q.display_order));
          setQuestions(data || []);
        } else {
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
          
          console.log('[LifeSupport] Questions loaded:', formattedData.length, 'questions');
          console.log('[LifeSupport] Questions order:', formattedData.map(q => q.display_order));
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
      fetchQuestions();
      setLoading(true);
    }
  }, [isDialogOpen, toast, currentLanguage]);

  return { questions, loading };
}
