
import { supabase } from "@/integrations/supabase/client";
import { Question, StandardQuestion, LifeSupportQuestion, QuestionResponse, Responses } from "./types";
import { QuestionnaireTable, ResponseTable, isValidQuestionnaireTable, isValidResponseTable } from "./typeValidators";

// Fetch questions from the appropriate table
export async function fetchQuestions(tableName: string): Promise<Question[]> {
  console.log(`Fetching questions from table: ${tableName}`);
  
  if (!isValidQuestionnaireTable(tableName)) {
    throw new Error(`Table "${tableName}" non reconnue dans le système`);
  }
  
  // Fetching questions
  const { data: questionsData, error: questionsError } = await supabase
    .from(tableName)
    .select('*')
    .order('display_order', { ascending: true });
  
  if (questionsError) {
    console.error('Error fetching questions:', questionsError);
    throw questionsError;
  }

  console.log('Questions data fetched:', questionsData);
  
  // Format questions based on table structure
  let formattedQuestions: Question[] = [];
  
  if (tableName === 'questionnaire_life_support_fr') {
    // Handle life support questions which have a different structure
    formattedQuestions = (questionsData as any[]).map(q => ({
      id: String(q.id), // Ensure id is string
      question: q.question_text,
      explanation: q.explanation,
      display_order: q.question_order,
      options: {
        yes: q.option_yes,
        no: q.option_no,
        unsure: q.option_unsure
      }
    }));
  } else {
    // Handle standard questions
    formattedQuestions = (questionsData as any[]).map(q => ({
      id: String(q.id), // Ensure id is string
      question: q.question,
      explanation: q.explanation,
      display_order: q.display_order,
      options: {
        yes: "Oui",
        no: "Non",
        unsure: "Je ne sais pas"
      }
    }));
  }
  
  console.log('Formatted questions:', formattedQuestions);
  return formattedQuestions;
}

// Fetch existing user responses
export async function fetchResponses(pageId: string, userId: string): Promise<Responses> {
  const responseTable = getResponseTable(pageId);
  console.log(`Fetching responses from table: ${responseTable}`);
  
  if (!isValidResponseTable(responseTable)) {
    throw new Error(`Table de réponses "${responseTable}" non reconnue dans le système`);
  }
  
  // Simplified type handling to avoid excessive type instantiation
  const response = await supabase
    .from(responseTable)
    .select('question_id, response')
    .eq('questionnaire_type', pageId)
    .eq('user_id', userId);
  
  if (response.error) {
    console.error('Error fetching responses:', response.error);
    throw response.error;
  }
  
  console.log('Responses data fetched:', response.data);
  
  // Convert responses array to object using a simpler approach
  const responsesObj: Responses = {};
  
  if (response.data) {
    for (const item of response.data) {
      responsesObj[item.question_id] = item.response;
    }
  }
  
  console.log('Responses object created:', responsesObj);
  return responsesObj;
}

// Get the appropriate table name for the questionnaire
export function getSectionTable(sectionId: string): string {
  console.log('Getting section table for:', sectionId);
  switch(sectionId) {
    case 'avis-general':
      return 'questionnaire_general_fr';
    case 'maintien-vie':
      return 'questionnaire_life_support_fr';
    case 'maladie-avancee':
      return 'questionnaire_advanced_illness_fr';
    case 'gouts-peurs':
      return 'questionnaire_preferences_fr';
    default:
      console.warn(`No table found for section: ${sectionId}`);
      return '';
  }
};

// Get the appropriate response table name
export function getResponseTable(sectionId: string): string {
  console.log('Getting response table for:', sectionId);
  if (sectionId === 'gouts-peurs') {
    return 'questionnaire_preferences_responses';
  }
  return 'questionnaire_responses';
};
