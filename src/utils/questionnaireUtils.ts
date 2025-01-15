import { BaseQuestion, JunctionData, QuestionnaireMapping } from "@/types/questions";
import { PostgrestError } from "@supabase/supabase-js";

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
  return Array.isArray(data) && data.every(q => 'id' in q);
}

export function isValidJunctionData(data: unknown): data is JunctionData[] {
  return Array.isArray(data) && data.every(j => 'answer_id' in j && 'question_id' in j);
}

export function handleSupabaseError(error: PostgrestError): never {
  console.error('Supabase error:', error);
  throw error;
}