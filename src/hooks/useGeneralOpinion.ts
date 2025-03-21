
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { saveResponses } from "@/utils/questionnaire/saveResponses";

// Define a type for our question objects
type QuestionObject = {
  id: string;
  question?: string;
  question_text?: string;
  display_order?: number;
  question_order?: number;
  created_at?: string;
  explanation?: string;
};

export function useGeneralOpinion(dialogOpen: boolean) {
  const [questions, setQuestions] = useState<QuestionObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  // Fetch questions when the dialog opens
  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log(`[GeneralOpinion] Fetching questions in ${currentLanguage}...`);
        
        const tableName = currentLanguage === 'en' 
          ? 'questionnaire_general_en' 
          : 'questionnaire_general_fr';
        
        console.log(`[GeneralOpinion] Using table: ${tableName}`);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order(currentLanguage === 'en' ? 'display_order' : 'question_order', { ascending: true });
        
        if (error) {
          console.error('[GeneralOpinion] Error fetching questions:', error);
          toast({
            title: currentLanguage === 'en' ? "Error" : "Erreur",
            description: currentLanguage === 'en' 
              ? "Unable to load questions. Please try again." 
              : "Impossible de charger les questions. Veuillez réessayer.",
            variant: "destructive",
          });
          return;
        }
        
        // Ensure the questions are sorted by their display order
        const sortedData = data?.sort((a: QuestionObject, b: QuestionObject) => {
          // First try to sort by question_order (for French)
          if (a.question_order !== undefined && b.question_order !== undefined) {
            return a.question_order - b.question_order;
          }
          // Then try to sort by display_order (for English)
          if (a.display_order !== undefined && b.display_order !== undefined) {
            return a.display_order - b.display_order;
          }
          return 0;
        });
        
        console.log('[GeneralOpinion] Questions loaded:', sortedData?.length, 'questions');
        console.log('[GeneralOpinion] Questions data:', sortedData);
        setQuestions(sortedData || []);
        
        // Fetch existing answers when questions are loaded
        if (sortedData && sortedData.length > 0) {
          await fetchExistingAnswers();
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

    async function fetchExistingAnswers() {
      try {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;
        
        if (!userId) {
          console.log('[GeneralOpinion] No user ID found, skipping answer fetch');
          return;
        }

        const { data: existingAnswers, error } = await supabase
          .from('questionnaire_responses')
          .select('question_id, response')
          .eq('user_id', userId)
          .eq('questionnaire_type', 'general_opinion');

        if (error) {
          console.error('[GeneralOpinion] Error fetching existing answers:', error);
          return;
        }

        if (existingAnswers && existingAnswers.length > 0) {
          const answersMap: Record<string, string[]> = {};
          
          existingAnswers.forEach(answer => {
            if (!answersMap[answer.question_id]) {
              answersMap[answer.question_id] = [];
            }
            if (answer.response) {
              answersMap[answer.question_id].push(answer.response);
            }
          });
          
          console.log('[GeneralOpinion] Loaded existing answers:', answersMap);
          setAnswers(answersMap);
        }
      } catch (error) {
        console.error('[GeneralOpinion] Error fetching existing answers:', error);
      }
    }

    if (dialogOpen) {
      fetchQuestions();
      setLoading(true);
    } else {
      // Reset answers when dialog closes to avoid stale data
      setAnswers({});
    }
  }, [dialogOpen, toast, currentLanguage]);

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log('[GeneralOpinion] Answer change:', { questionId, value });
    setAnswers(prev => ({
      ...prev,
      [questionId]: [value]
    }));
  };

  const handleSubmit = async () => {
    const success = await saveResponses({
      userId: (await supabase.auth.getSession()).data.session?.user.id,
      answers,
      questions,
      questionnaireType: 'general_opinion',
      toast,
      language: currentLanguage as 'en' | 'fr'
    });
    
    return success;
  };

  return {
    questions,
    loading,
    answers,
    handleAnswerChange,
    handleSubmit
  };
}
