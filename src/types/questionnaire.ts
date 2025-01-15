export interface QuestionnaireAnswer {
  id: string;
  question_id: string;
  question: {
    Question?: string;
    question?: string;
  };
  answer: string;
}

export type QuestionnaireType = "general_opinion" | "life_support" | "advanced_illness" | "preferences";

export type ResponseTableName = 
  | "questionnaire_general_responses"
  | "questionnaire_life_support_responses"
  | "questionnaire_advanced_illness_responses"
  | "questionnaire_preferences_responses";

export const getResponseTableName = (type: QuestionnaireType): ResponseTableName => {
  switch (type) {
    case "life_support":
      return "questionnaire_life_support_responses";
    case "advanced_illness":
      return "questionnaire_advanced_illness_responses";
    case "preferences":
      return "questionnaire_preferences_responses";
    default:
      return "questionnaire_general_responses";
  }
};

export type TableName = 
  | "questions"
  | "life_support_questions"
  | "advanced_illness_questions"
  | "preferences_questions";

export const getTableName = (type: QuestionnaireType): TableName => {
  switch (type) {
    case "life_support":
      return "life_support_questions";
    case "advanced_illness":
      return "advanced_illness_questions";
    case "preferences":
      return "preferences_questions";
    default:
      return "questions";
  }
};