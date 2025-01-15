import { BaseQuestion, JunctionData, QuestionnaireMapping } from "@/types/questions";
import { PostgrestError } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

export const QUESTIONNAIRE_MAPPINGS: Record<string, QuestionnaireMapping> = {
  general_opinion: {
    questionsTable: "questions",
    junctionTable: "questionnaire_general_opinion_answers",
    questionField: "Question",
  },
  life_support: {
    questionsTable: "life_support_questions",
    junctionTable: "questionnaire_life_support_answers",
    questionField: "question",
  },
  advanced_illness: {
    questionsTable: "advanced_illness_questions",
    junctionTable: "questionnaire_advanced_illness_answers",
    questionField: "question",
  },
  preferences: {
    questionsTable: "preferences_questions",
    junctionTable: "questionnaire_preferences_answers",
    questionField: "question",
  },
};

export function isValidQuestionsData(data: unknown): data is BaseQuestion[] {
  if (!Array.isArray(data)) return false;
  return data.every(q => 
    typeof q === 'object' && 
    q !== null && 
    'id' in q && 
    typeof q.id === 'string' &&
    (('Question' in q && typeof q.Question === 'string') || 
     ('question' in q && typeof q.question === 'string'))
  );
}

export function isValidJunctionData(data: unknown): data is JunctionData[] {
  if (!Array.isArray(data)) return false;
  return data.every(j => 
    typeof j === 'object' && 
    j !== null && 
    'answer_id' in j && 
    'question_id' in j &&
    typeof j.answer_id === 'string' &&
    typeof j.question_id === 'string'
  );
}

export function handleSupabaseError(error: PostgrestError): never {
  console.error('Supabase error:', error);
  throw error;
}