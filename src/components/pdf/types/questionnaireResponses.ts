
export interface QuestionnaireResponse {
  id: string;
  user_id: string;
  question_id: string;
  question_text: string;
  response: string;
  questionnaire_type: string;
  created_at: string;
}

export interface QuestionnaireResponses {
  general: QuestionnaireResponse[];
  lifeSupport: QuestionnaireResponse[];
  advancedIllness: QuestionnaireResponse[];
  preferences: QuestionnaireResponse[];
}

export interface Synthesis {
  free_text: string;
  user_id: string;
  created_at?: string;
}
