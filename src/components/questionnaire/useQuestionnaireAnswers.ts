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
      
      // First get the answers
      const { data: answers, error: answersError } = await supabase
        .from('questionnaire_answers')
        .select('id, answer, question_id')
        .eq('questionnaire_type', questionnaireType);

      if (answersError) {
        console.error(`Error fetching ${questionnaireType} answers:`, answersError);
        throw answersError;
      }

      if (!answers?.length) {
        return [];
      }

      // Then get the questions based on questionnaire type
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
        .select('id, ' + questionField);

      if (questionsError) {
        console.error(`Error fetching ${questionnaireType} questions:`, questionsError);
        throw questionsError;
      }

      // Map answers with their corresponding questions
      const questionsMap = new Map(questions.map(q => [q.id, q[questionField as keyof typeof q]]));
      
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