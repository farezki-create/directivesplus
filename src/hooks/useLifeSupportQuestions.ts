
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
        setLoading(true);
        console.log(`[LifeSupport] Fetching questions in language: ${currentLanguage}`);
        
        if (currentLanguage === 'en') {
          // Fetch English questions
          console.log(`[LifeSupport] Fetching from table: questionnaire_life_support_en`);
          const { data, error } = await supabase
            .from('questionnaire_life_support_en')
            .select('*')
            .order('display_order', { ascending: true });
          
          if (error) {
            console.error('[LifeSupport] Error fetching English questions:', error);
            toast({
              title: "Error",
              description: "Unable to load questions. Please try again.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          
          console.log('[LifeSupport] English questions loaded:', data?.length || 0);
          console.log('[LifeSupport] Raw English data:', data);
          
          // Ensure options are properly formatted
          const formattedData = data?.map(item => ({
            id: item.id,
            question: item.question,
            display_order: item.display_order,
            options: {
              yes: "Yes",
              no: "No",
              unsure: "I'm not sure"
            }
          })) || [];
          
          console.log('[LifeSupport] Formatted English questions:', formattedData);
          setQuestions(formattedData);
        } else {
          // Fetch French questions
          console.log(`[LifeSupport] Fetching from table: questionnaire_life_support_fr`);
          const { data, error } = await supabase
            .from('questionnaire_life_support_fr')
            .select('*')
            .order('question_order', { ascending: true });
          
          if (error) {
            console.error('[LifeSupport] Error fetching French questions:', error);
            toast({
              title: "Erreur",
              description: "Impossible de charger les questions. Veuillez réessayer.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          
          console.log('[LifeSupport] Raw French data:', data);
          
          // Transform French questions to match expected format
          const formattedData = data?.map(item => ({
            id: item.id.toString(),
            question: item.question_text,
            display_order: item.question_order,
            options: {
              yes: item.option_yes,
              no: item.option_no,
              unsure: item.option_unsure
            }
          })) || [];
          
          console.log('[LifeSupport] Formatted French questions:', formattedData);
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
    } else {
      // Reset questions when dialog is closed
      setQuestions([]);
    }
  }, [isDialogOpen, toast, currentLanguage, t]);

  return { questions, loading };
}
