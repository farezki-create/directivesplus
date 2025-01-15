import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuestionnaireAnswer } from "@/types/questionnaire";

type QuestionnaireType = "general_opinion" | "life_support" | "advanced_illness" | "preferences";

interface QuestionTableMapping {
  tableName: string;
  junctionTableName: string;
  questionField: string;
}

const questionTableMappings: Record<QuestionnaireType, QuestionTableMapping> = {
  general_opinion: {
    tableName: "questions",
    junctionTableName: "questionnaire_general_opinion_answers",
    questionField: "Question"
  },
  life_support: {
    tableName: "life_support_questions",
    junctionTableName: "questionnaire_life_support_answers",
    questionField: "question"
  },
  advanced_illness: {
    tableName: "advanced_illness_questions",
    junctionTableName: "questionnaire_advanced_illness_answers",
    questionField: "question"
  },
  preferences: {
    tableName: "preferences_questions",
    junctionTableName: "questionnaire_preferences_answers",
    questionField: "question"
  }
};

export function useQuestionnaireAnswers(questionnaireType: QuestionnaireType) {
  return useQuery({
    queryKey: [`${questionnaireType}-answers`],
    queryFn: async () => {
      console.log(`Fetching ${questionnaireType} answers...`);
      
      const mapping = questionTableMappings[questionnaireType];
      
      // First get the answers
      const { data: answers, error: answersError } = await supabase
        .from('questionnaire_answers')
        .select('id, answer')
        .eq('questionnaire_type', questionnaireType);

      if (answersError) {
        console.error(`Error fetching ${questionnaireType} answers:`, answersError);
        throw answersError;
      }

      if (!answers?.length) {
        return [];
      }

      // Get the questions through the junction table
      const { data: questionsData, error: questionsError } = await supabase
        .from(mapping.tableName)
        .select(`
          id,
          ${mapping.questionField}
        `);

      if (questionsError) {
        console.error(`Error fetching ${questionnaireType} questions:`, questionsError);
        throw questionsError;
      }

      // Create a map of questions for easy lookup
      const questionsMap = new Map(
        questionsData.map(q => [q.id, q[mapping.questionField]])
      );

      // Get the junction table data to link answers with questions
      const { data: junctionData, error: junctionError } = await supabase
        .from(mapping.junctionTableName)
        .select('*');

      if (junctionError) {
        console.error(`Error fetching junction data for ${questionnaireType}:`, junctionError);
        throw junctionError;
      }

      // Create a map of answer_id to question_id
      const answerQuestionMap = new Map(
        junctionData.map(j => [j.answer_id, j.question_id])
      );

      // Map answers with their corresponding questions
      return answers.map(answer => ({
        id: answer.id,
        answer: answer.answer,
        question: {
          question: questionsMap.get(answerQuestionMap.get(answer.id))
        }
      })) as QuestionnaireAnswer[];
    },
  });
}