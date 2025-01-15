import { Database } from "@/integrations/supabase/types";

export interface BaseQuestion {
  id: string;
  Question?: string;
  question?: string;
}

export interface JunctionData {
  answer_id: string;
  question_id: string;
}

export interface QuestionnaireMapping {
  questionsTable: keyof Database['public']['Tables'];
  junctionTable: keyof Database['public']['Tables'];
  questionField: "Question" | "question";
}

export interface QuestionnaireAnswer {
  id: string;
  question: {
    Question?: string;
    question?: string;
  };
  answer: string;
}

export type QuestionnaireType = 'general_opinion' | 'life_support' | 'advanced_illness' | 'preferences';