
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/language/useLanguage";
import { SupportedLanguage } from "@/hooks/language/translations/types";

export interface LifeSupportQuestion {
  id: string;
  question: string;
  display_order: number;
}

export function useLifeSupportQuestions(open: boolean) {
  const [questions, setQuestions] = useState<LifeSupportQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log(`[LifeSupport] Fetching questions in ${currentLanguage}...`);
        setError(null);
        
        if (currentLanguage === 'en' as SupportedLanguage) {
          // Fetch English questions
          const { data, error } = await supabase
            .from('life_support_questions_en')
            .select('*')
            .order('display_order', { ascending: true });
          
          if (error) {
            console.error('[LifeSupport] Error fetching questions:', error);
            setError(error.message);
            toast({
              title: "Error",
              description: "Unable to load questions. Please try again.",
              variant: "destructive",
            });
            return;
          }
          
          console.log('[LifeSupport] Questions loaded:', data?.length, 'questions');
          if (data?.length === 0) {
            console.log('[LifeSupport] No questions found in database');
            setError(currentLanguage === 'fr' as SupportedLanguage 
              ? "Aucune question n'a été trouvée dans la base de données." 
              : "No questions were found in the database.");
          }
          setQuestions(data || []);
        } else {
          // Fetch French questions
          const { data, error } = await supabase
            .from('life_support_questions')
            .select('*')
            .order('display_order', { ascending: true });
          
          if (error) {
            console.error('[LifeSupport] Error fetching questions:', error);
            setError(error.message);
            toast({
              title: "Erreur",
              description: "Impossible de charger les questions. Veuillez réessayer.",
              variant: "destructive",
            });
            return;
          }
          
          console.log('[LifeSupport] Questions loaded:', data?.length, 'questions');
          if (data?.length === 0) {
            console.log('[LifeSupport] No questions found in database');
            setError(currentLanguage === 'fr' as SupportedLanguage 
              ? "Aucune question n'a été trouvée dans la base de données." 
              : "No questions were found in the database.");
          }
          setQuestions(data || []);
        }
      } catch (error) {
        console.error('[LifeSupport] Unexpected error:', error);
        setError((error as Error).message);
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

  return { questions, loading, error };
}
