
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { saveResponses } from "@/utils/questionnaire/saveResponses";

export function useAdvancedIllnessResponses(questions: any[]) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  // Charger les réponses existantes lorsque les questions changent
  useEffect(() => {
    const fetchExistingAnswers = async () => {
      try {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;
        
        if (!userId || questions.length === 0) {
          return;
        }

        const { data: existingAnswers, error } = await supabase
          .from('questionnaire_responses')
          .select('question_id, response')
          .eq('user_id', userId)
          .eq('questionnaire_type', 'advanced_illness');

        if (error) {
          console.error('[AdvancedIllness] Error fetching existing answers:', error);
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
          
          console.log('[AdvancedIllness] Loaded existing answers:', answersMap);
          setAnswers(answersMap);
        }
      } catch (error) {
        console.error('[AdvancedIllness] Error fetching existing answers:', error);
      }
    };

    if (questions.length > 0) {
      fetchExistingAnswers();
    }
  }, [questions]);

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log('[AdvancedIllness] Answer change:', { questionId, value });
    setAnswers(prev => ({
      ...prev,
      [questionId]: [value]
    }));
  };

  const handleSubmit = async () => {
    try {
      const userId = (await supabase.auth.getSession()).data.session?.user.id;
      
      const success = await saveResponses({
        userId,
        answers,
        questions,
        questionnaireType: 'advanced_illness',
        toast,
        language: currentLanguage as 'en' | 'fr'
      });
      
      return success;
    } catch (error) {
      console.error('[AdvancedIllness] Error during submission:', error);
      return false;
    }
  };

  return {
    answers,
    handleAnswerChange,
    handleSubmit
  };
}
