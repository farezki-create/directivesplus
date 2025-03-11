
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
          // Pour l'anglais, récupérer depuis la table anglaise
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
            setLoading(false);
            return;
          }
          
          console.log('[LifeSupport] English questions loaded:', data?.length || 0, 'questions');
          if (data?.length > 0) {
            console.log('[LifeSupport] First English question:', data[0]);
          } else {
            console.log('[LifeSupport] No English questions found');
          }
          
          setQuestions(data || []);
        } else {
          // Pour le français, récupérer depuis la table française qui a une structure différente
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
          
          console.log('[LifeSupport] Raw French questions loaded:', data?.length || 0, 'questions');
          if (data?.length > 0) {
            console.log('[LifeSupport] Sample French question:', data[0]);
          } else {
            console.log('[LifeSupport] No French questions found');
          }
          
          // Transformer les questions françaises pour correspondre au format attendu dans les composants
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
          
          console.log('[LifeSupport] Formatted French questions:', formattedData.length, 'questions');
          if (formattedData.length > 0) {
            console.log('[LifeSupport] First formatted French question:', formattedData[0]);
          }
          
          setQuestions(formattedData);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('[LifeSupport] Unexpected error:', error);
        toast({
          title: currentLanguage === 'en' ? "Error" : "Erreur",
          description: currentLanguage === 'en' 
            ? "An unexpected error occurred." 
            : "Une erreur inattendue s'est produite.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }

    if (isDialogOpen) {
      setLoading(true);
      fetchQuestions();
    } else {
      // Réinitialiser les questions lorsque le dialogue est fermé
      setQuestions([]);
    }
  }, [isDialogOpen, toast, currentLanguage, t]);

  return { questions, loading };
}
