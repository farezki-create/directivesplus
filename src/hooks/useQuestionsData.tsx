
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  question: string;
  Question?: string;
  display_order?: number;
  order?: number;
  category?: string;
}

export function useQuestionsData(open: boolean, category: string = 'general_opinion') {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    setAnswers({});
  }, [currentLanguage]);

  useEffect(() => {
    async function fetchQuestions() {
      if (!open) return;
      
      setLoading(true);
      try {
        console.log(`[GeneralOpinion] Fetching questions in ${currentLanguage}...`);
        
        if (currentLanguage === 'en') {
          // Fetch English questions
          const { data, error } = await supabase
            .from('questions_en')
            .select('*')
            .eq('category', category)
            .order('display_order', { ascending: true });
          
          if (error) {
            console.error('[GeneralOpinion] Error fetching questions:', error);
            toast({
              title: "Error",
              description: "Unable to load questions. Please try again.",
              variant: "destructive",
            });
            return;
          }
          
          console.log('[GeneralOpinion] Questions loaded:', data?.length, 'questions');
          setQuestions(data || []);
        } else {
          // Fetch French questions
          const { data, error } = await supabase
            .from('questions')
            .select('*')
            .eq('category', category)
            .order('display_order', { ascending: true });
          
          if (error) {
            console.error('[GeneralOpinion] Error fetching questions:', error);
            toast({
              title: "Erreur",
              description: "Impossible de charger les questions. Veuillez réessayer.",
              variant: "destructive",
            });
            return;
          }
          
          // Normalize field names for consistent usage
          const normalizedQuestions = data?.map(q => ({
            ...q,
            question: q.Question, // Ensure all objects have a question property
          })) || [];
          
          console.log('[GeneralOpinion] Questions loaded:', normalizedQuestions.length, 'questions');
          setQuestions(normalizedQuestions);
        }
      } catch (error) {
        console.error('[GeneralOpinion] Unexpected error:', error);
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

    fetchQuestions();
  }, [open, toast, currentLanguage, category]);

  const handleAnswerChange = (questionId: string, value: string, checked: boolean) => {
    console.log(`[useQuestionsData] Answer change for question ${questionId}: ${value}, checked: ${checked}`);
    
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      
      if (checked) {
        // Add the value if it's not already in the array
        if (!currentAnswers.includes(value)) {
          return {
            ...prev,
            [questionId]: [...currentAnswers, value]
          };
        }
      } else {
        // Remove the value if checked is false
        return {
          ...prev,
          [questionId]: currentAnswers.filter(v => v !== value)
        };
      }
      
      return prev;
    });
  };

  return {
    questions,
    loading,
    answers,
    setAnswers,
    handleAnswerChange
  };
}
