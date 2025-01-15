import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuestionnaireAnswer } from "@/types/questionnaire";

export function useQuestionnaireAnswers(questionnaireType: string) {
  return useQuery({
    queryKey: [`${questionnaireType}-answers`],
    queryFn: async () => {
      console.log(`Fetching ${questionnaireType} answers...`);
      const { data: answers, error } = await supabase
        .from('questionnaire_answers')
        .select(`
          id,
          answer,
          question:question_id (
            Question,
            question
          )
        `)
        .eq('questionnaire_type', questionnaireType);

      if (error) {
        console.error(`Error fetching ${questionnaireType} answers:`, error);
        throw error;
      }
      return answers as QuestionnaireAnswer[];
    },
  });
}