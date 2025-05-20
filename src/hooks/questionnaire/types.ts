
export type QuestionnaireResponse = {
  question_id: string;
  response: string;
};

export type ResponseToSave = {
  question_id: string;
  response: string;
  questionnaire_type?: string;
  question_text: string;
  user_id: string;
};
