
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

// Define response types
export type QuestionResponse = {
  question_id: string;
  response: string;
};

// Define the response type for saving to database
export type ResponseData = {
  question_id: string;
  response: string;
  questionnaire_type: string;
  user_id: string;
  question_text: string;
};

export type Responses = Record<string, string>;

// User response type
export type UserResponse = {
  id: string;
  questionId: string;
  response: string;
  createdAt: string;
  updatedAt: string;
};

// Add table name types to help with typesafety
export type QuestionnaireTableName = 
  | "questionnaire_general_fr" 
  | "questionnaire_life_support_fr"
  | "questionnaire_advanced_illness_fr" 
  | "questionnaire_preferences_fr";

export type ResponseTableName = 
  | "questionnaire_responses"
  | "questionnaire_preferences_responses";
