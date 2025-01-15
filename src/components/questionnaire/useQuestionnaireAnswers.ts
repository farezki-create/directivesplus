import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuestionnaireAnswer } from "@/types/questionnaire";
import { Database } from "@/integrations/supabase/types";

type QuestionnaireType = "general_opinion" | "life_support" | "advanced_illness" | "preferences";
type TableNames = Database["public"]["Tables"];

export function useQuestionnaireAnswers(questionnaireType: QuestionnaireType) {
  return useQuery({
    queryKey: [`${questionnaireType}-answers`],
    queryFn: async () => {
      console.log(`Fetching ${questionnaireType} answers...`);
      
      const { data: answers, error: answersError } = await supabase
        .from('questionnaire_answers')
        .select('*')
        .eq('questionnaire_type', questionnaireType);

      if (answersError) {
        console.error(`Error fetching ${questionnaireType} answers:`, answersError);
        throw answersError;
      }

      if (!answers?.length) {
        return [];
      }

      let questionsTable: keyof TableNames;
      let questionField: string;
      
      switch (questionnaireType) {
        case 'life_support':
          questionsTable = 'life_support_questions';
          questionField = 'question';
          break;
        case 'advanced_illness':
          questionsTable = 'advanced_illness_questions';
          questionField = 'question';
          break;
        case 'preferences':
          questionsTable = 'preferences_questions';
          questionField = 'question';
          break;
        default:
          questionsTable = 'questions';
          questionField = 'Question';
      }

      const { data: questions, error: questionsError } = await supabase
        .from(questionsTable)
        .select('*');

      if (questionsError) {
        console.error(`Error fetching ${questionnaireType} questions:`, questionsError);
        throw questionsError;
      }

      const questionsMap = new Map(
        questions.map((q: any) => [q.id, q[questionField]])
      );

      return answers.map(answer => ({
        id: answer.id,
        answer: answer.answer,
        question: {
          question: questionsMap.get(answer.question_id)
        }
      })) as QuestionnaireAnswer[];
    },
  });
}