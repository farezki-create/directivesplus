import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthState } from "@/hooks/useAuthState";
import { QUESTIONNAIRE_MAPPINGS, isValidQuestionsData, isValidJunctionData, handleSupabaseError } from "@/utils/questionnaireUtils";
import type { QuestionnaireAnswer } from "@/types/questions";

export function useQuestionnaireAnswers(questionnaireType: string) {
  const { user } = useAuthState();
  const mapping = QUESTIONNAIRE_MAPPINGS[questionnaireType];

  return useQuery({
    queryKey: ['questionnaire-answers', questionnaireType, user?.id],
    queryFn: async () => {
      if (!user?.id || !mapping) {
        return [];
      }

      // Get answers for the current user
      const { data: answersData, error: answersError } = await supabase
        .from('questionnaire_answers')
        .select('id, answer')
        .eq('user_id', user.id)
        .eq('questionnaire_type', questionnaireType);

      if (answersError) {
        handleSupabaseError(answersError);
      }

      if (!answersData?.length) {
        return [];
      }

      // Get questions data
      const { data: questionsData, error: questionsError } = await supabase
        .from(mapping.questionsTable)
        .select('id, ' + mapping.questionField);

      if (questionsError) {
        handleSupabaseError(questionsError);
      }

      if (!isValidQuestionsData(questionsData)) {
        console.error('Invalid questions data format');
        return [];
      }

      // Create a map of questions for easy lookup
      const questionsMap = new Map(
        questionsData.map(q => [q.id, q[mapping.questionField]])
      );

      // Get the junction table data
      const { data: junctionData, error: junctionError } = await supabase
        .from(mapping.junctionTable)
        .select('answer_id, question_id');

      if (junctionError) {
        handleSupabaseError(junctionError);
      }

      if (!isValidJunctionData(junctionData)) {
        console.error('Invalid junction data format');
        return [];
      }

      // Create a map of answer_id to question_id
      const answerQuestionMap = new Map(
        junctionData.map(j => [j.answer_id, j.question_id])
      );

      // Map answers with their corresponding questions
      return answersData.map((answer): QuestionnaireAnswer => {
        const questionId = answerQuestionMap.get(answer.id);
        const questionText = questionId ? questionsMap.get(questionId) : undefined;

        return {
          id: answer.id,
          question: {
            [mapping.questionField]: questionText
          },
          answer: answer.answer
        };
      });
    },
    enabled: !!user?.id
  });
}