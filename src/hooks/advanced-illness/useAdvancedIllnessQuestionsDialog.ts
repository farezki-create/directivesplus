
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export function useAdvancedIllnessQuestionsDialog(open: boolean) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();

  // Reset answers when language changes
  useEffect(() => {
    setAnswers({});
  }, [currentLanguage]);

  // Fetch questions based on language
  useEffect(() => {
    async function fetchQuestions() {
      if (!open) return;
      
      setLoading(true);
      try {
        console.log(`[AdvancedIllness] Fetching questions in ${currentLanguage}...`);
        
        if (currentLanguage === 'en') {
          // Fetch English questions
          const { data, error } = await supabase
            .from('advanced_illness_questions_en')
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
            .from('advanced_illness_questions')
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

    fetchQuestions();
  }, [open, toast, currentLanguage]);

  const handleAnswerChange = (questionId: string, value: string, checked: boolean) => {
    console.log('[AdvancedIllness] Answer change:', { questionId, value, checked });
    
    if (checked) {
      setAnswers(prev => {
        // When adding an option
        const updatedValues = [...(prev[questionId] || [])];
        if (!updatedValues.includes(value)) {
          updatedValues.push(value);
        }
        return {
          ...prev,
          [questionId]: updatedValues
        };
      });
    } else {
      setAnswers(prev => {
        // When removing an option
        const newValues = prev[questionId]?.filter(v => v !== value) || [];
        return {
          ...prev,
          [questionId]: newValues
        };
      });
    }
  };

  return {
    questions,
    loading,
    answers,
    handleAnswerChange,
    currentLanguage,
    t
  };
}
