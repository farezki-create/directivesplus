import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuestionnaireAnswer } from "@/types/questionnaire";

type QuestionnaireType = "general_opinion" | "life_support" | "advanced_illness" | "preferences";

interface QuestionTableMapping {
  tableName: "questions" | "life_support_questions" | "advanced_illness_questions" | "preferences_questions";
  junctionTableName: "questionnaire_general_opinion_answers" | "questionnaire_life_support_answers" | "questionnaire_advanced_illness_answers" | "questionnaire_preferences_answers";
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

interface BaseQuestion {
  id: string;
  [key: string]: any;
}

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

      // Get the questions
      const { data: questionsData, error: questionsError } = await supabase
        .from(mapping.tableName)
        .select('id, ' + mapping.questionField);

      if (questionsError) {
        console.error(`Error fetching ${questionnaireType} questions:`, questionsError);
        throw questionsError;
      }

      // Type guard to ensure questionsData is an array of BaseQuestion
      if (!Array.isArray(questionsData) || !questionsData.every(q => 'id' in q)) {
        console.error('Invalid questions data format');
        return [];
      }

      // Create a map of questions for easy lookup
      const questionsMap = new Map(
        questionsData.map(q => [q.id, q[mapping.questionField]])
      );

      // Get the junction table data
      interface JunctionData {
        answer_id: string;
        question_id: string;
      }

      const { data: junctionData, error: junctionError } = await supabase
        .from(mapping.junctionTableName)
        .select('answer_id, question_id');

      if (junctionError) {
        console.error(`Error fetching junction data for ${questionnaireType}:`, junctionError);
        throw junctionError;
      }

      // Type guard for junction data
      if (!Array.isArray(junctionData)) {
        console.error('Invalid junction data format');
        return [];
      }

      // Create a map of answer_id to question_id
      const answerQuestionMap = new Map(
        (junctionData as JunctionData[]).map(j => [j.answer_id, j.question_id])
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