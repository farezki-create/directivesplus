import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAnswersState(open: boolean) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    const initializeAnswers = async () => {
      if (open) {
        console.log('[AdvancedIllness] Dialog opened, resetting answers');
        setAnswers({}); // Reset answers when dialog opens
        await fetchExistingAnswers(); // Fetch after reset
      }
    };

    initializeAnswers();
  }, [open]);

  const fetchExistingAnswers = async () => {
    try {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      
      if (!userId) {
        console.log('[AdvancedIllness] No user ID found for fetching existing answers');
        return;
      }

      const { data, error } = await supabase
        .from('questionnaire_advanced_illness_responses')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('[AdvancedIllness] Error fetching existing answers:', error);
        return;
      }

      if (data) {
        const groupedAnswers: Record<string, string[]> = {};
        data.forEach(response => {
          if (!groupedAnswers[response.question_id]) {
            groupedAnswers[response.question_id] = [];
          }
          groupedAnswers[response.question_id].push(response.response);
        });
        console.log('[AdvancedIllness] Loaded existing answers:', groupedAnswers);
        setAnswers(groupedAnswers);
      }
    } catch (error) {
      console.error('[AdvancedIllness] Error in fetchExistingAnswers:', error);
    }
  };

  const handleAnswerChange = (questionId: string, value: string, checked: boolean) => {
    console.log('[AdvancedIllness] Answer change:', { questionId, value, checked });
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentAnswers, value]
        };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter(v => v !== value)
        };
      }
    });
  };

  return { answers, setAnswers, handleAnswerChange };
}