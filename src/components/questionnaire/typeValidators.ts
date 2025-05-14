
// Type validation helper functions

// Liste des tables de questionnaires autorisées pour le typage
export type QuestionnaireTable = 
  | "questionnaire_general_fr" 
  | "questionnaire_life_support_fr"
  | "questionnaire_advanced_illness_fr" 
  | "questionnaire_preferences_fr";

// Liste des tables de réponses autorisées pour le typage
export type ResponseTable = 
  | "questionnaire_responses"
  | "questionnaire_preferences_responses";

// Fonction helper pour vérifier si une table de questionnaire est valide
export function isValidQuestionnaireTable(tableName: string): tableName is QuestionnaireTable {
  return [
    'questionnaire_general_fr',
    'questionnaire_life_support_fr',
    'questionnaire_advanced_illness_fr',
    'questionnaire_preferences_fr'
  ].includes(tableName);
}

// Fonction helper pour vérifier si une table de réponses est valide
export function isValidResponseTable(tableName: string): tableName is ResponseTable {
  return [
    'questionnaire_responses',
    'questionnaire_preferences_responses'
  ].includes(tableName);
}
