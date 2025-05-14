
// Define specific types for each question format
export type BaseQuestion = {
  id: string;
  explanation?: string | null;
  display_order?: number | null;
};

export type StandardQuestion = BaseQuestion & {
  question: string;
};

export type LifeSupportQuestion = BaseQuestion & {
  id: string | number;
  question_text: string;
  question_order: number;
  option_yes: string;
  option_no: string;
  option_unsure: string;
};

// Define our unified Question type
export type Question = {
  id: string;
  question: string;
  explanation?: string | null;
  display_order?: number | null;
  options?: {
    yes: string;
    no: string;
    unsure: string;
  };
};

// Define specific response type
export type QuestionResponse = {
  question_id: string;
  response: string;
};

// Define the save response type
export type ResponseToSave = {
  question_id: string;
  response: string;
  questionnaire_type: string;
  user_id: string;
  question_text: string;
};

export type Responses = Record<string, string>;
