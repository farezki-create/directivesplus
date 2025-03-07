
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/language/useLanguage";

export type QuestionnaireType = 'general' | 'life_support' | 'advanced_illness' | 'preferences';

export interface QuestionnaireQuestion {
  id: string;
  question: string;
  display_order: number;
}

export function useQuestionnaireQuestions(
  type: QuestionnaireType,
  open: boolean
) {
  const [questions, setQuestions] = useState<QuestionnaireQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log(`[Questionnaire] Fetching ${type} questions in ${currentLanguage}...`);
        
        // Determine table name based on type and language
        const tableName = `questionnaire_${type}_${currentLanguage}`;
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('display_order', { ascending: true });
        
        if (error) {
          console.error(`[Questionnaire] Error fetching ${type} questions:`, error);
          toast({
            title: currentLanguage === 'en' ? "Error" : "Erreur",
            description: currentLanguage === 'en' 
              ? "Unable to load questions. Please try again." 
              : "Impossible de charger les questions. Veuillez réessayer.",
            variant: "destructive",
          });
          return;
        }
        
        console.log(`[Questionnaire] ${type} questions loaded:`, data?.length, 'questions');
        setQuestions(data || []);
      } catch (error) {
        console.error(`[Questionnaire] Unexpected error:`, error);
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
    }
  }, [open, toast, currentLanguage, type]);

  return { questions, loading };
}
