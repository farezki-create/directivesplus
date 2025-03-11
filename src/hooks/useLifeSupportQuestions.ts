
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
        console.log(`[LifeSupport] Tentative de connexion à Supabase...`);
        console.log(`[LifeSupport] Langue actuelle: ${currentLanguage}`);
        
        if (currentLanguage === 'en') {
          // Fetch English questions
          console.log(`[LifeSupport] Fetching English questions...`);
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
          setQuestions(data || []);
        } else {
          // Fetch French questions
          console.log(`[LifeSupport] Récupération des questions françaises...`);
          const { data, error } = await supabase
            .from('questionnaire_life_support_fr')
            .select('*')
            .order('question_order', { ascending: true });
          
          if (error) {
            console.error('[LifeSupport] Erreur lors de la récupération des questions françaises:', error);
            toast({
              title: "Erreur",
              description: "Impossible de charger les questions. Veuillez réessayer.",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
          
          console.log('[LifeSupport] Données brutes des questions françaises:', data);
          
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
          
          console.log('[LifeSupport] Questions françaises formatées:', formattedData);
          setQuestions(formattedData);
        }
      } catch (error) {
        console.error('[LifeSupport] Erreur inattendue:', error);
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
