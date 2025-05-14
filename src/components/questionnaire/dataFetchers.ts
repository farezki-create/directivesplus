
import { supabase } from "@/integrations/supabase/client";
import { Question, QuestionnaireTableName, ResponseTableName, Responses } from "./types";

// Helper function to get the right table name for questionnaire sections
export const getSectionTable = (sectionId: string): QuestionnaireTableName => {
  switch(sectionId) {
    case 'avis-general': 
      return "questionnaire_general_fr";
    case 'maintien-vie': 
      return "questionnaire_life_support_fr";
    case 'maladie-avancee': 
      return "questionnaire_advanced_illness_fr";
    case 'gouts-peurs':
    case 'personne-confiance':
    case 'exemples-phrases': 
      return "questionnaire_preferences_fr";
    default:
      throw new Error(`Unknown section ID: ${sectionId}`);
  }
};

// Helper function to get the response table name
export const getResponseTable = (sectionId: string): ResponseTableName => {
  // Some sections use a different table for responses
  if (['gouts-peurs', 'personne-confiance', 'exemples-phrases'].includes(sectionId)) {
    return "questionnaire_preferences_responses";
  }
  return "questionnaire_responses";
};

// Fetch questions from the database
export const fetchQuestions = async (tableName: QuestionnaireTableName): Promise<Question[]> => {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('display_order', { ascending: true });
    
    if (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    // Transform the questions based on the table type
    if (tableName === "questionnaire_life_support_fr") {
      // Handle life support questions specifically
      return data.map(item => {
        // Type assertion here to help TypeScript understand the structure
        const lifeSupportItem = item as unknown as {
          id: number;
          question_text: string;
          explanation?: string;
          question_order: number;
          option_yes: string;
          option_no: string;
          option_unsure: string;
        };
        
        return {
          id: String(lifeSupportItem.id),
          question: lifeSupportItem.question_text,
          explanation: lifeSupportItem.explanation,
          display_order: lifeSupportItem.question_order,
          options: {
            yes: lifeSupportItem.option_yes,
            no: lifeSupportItem.option_no,
            unsure: lifeSupportItem.option_unsure
          }
        };
      });
    } else {
      // Handle standard questions
      return data.map(item => {
        // Type assertion for standard question format
        const standardItem = item as unknown as {
          id: string;
          question: string;
          explanation?: string;
          display_order?: number;
        };
        
        return {
          id: String(standardItem.id),
          question: standardItem.question,
          explanation: standardItem.explanation,
          display_order: standardItem.display_order
        };
      });
    }
  } catch (err) {
    console.error("Failed to fetch questions:", err);
    throw err;
  }
};

// Fetch questionnaire responses for a specific user
export const fetchResponses = async (questionnaireId: string, userId: string): Promise<Responses> => {
  try {
    const tableName = getResponseTable(questionnaireId);
    
    // Use a simpler approach to avoid excessive type instantiation
    const { data, error } = await supabase
      .from(tableName)
      .select('question_id, response')
      .eq('user_id', userId)
      .eq('questionnaire_type', questionnaireId);

    if (error) {
      console.error("Error fetching responses:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return {};
    }

    // Create a simple response map
    const responseMap: Responses = {};
    
    // Use a normal for loop to simplify type handling
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item && item.question_id) {
        responseMap[item.question_id] = item.response || '';
      }
    }

    return responseMap;
  } catch (err) {
    console.error("Failed to fetch responses:", err);
    throw err;
  }
};

// Save a user's response to a questionnaire
export const saveResponse = async (
  questionnaireId: string,
  questionId: string,
  userId: string,
  response: string
): Promise<void> => {
  try {
    const tableName = getResponseTable(questionnaireId);
    
    // Check if response already exists
    const { data: existingResponse, error: existingError } = await supabase
      .from(tableName)
      .select('id')
      .eq('questionnaire_type', questionnaireId)
      .eq('question_id', questionId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error("Error checking existing response:", existingError);
      throw existingError;
    }

    if (existingResponse) {
      // Update existing response
      const { error } = await supabase
        .from(tableName)
        .update({ response })
        .eq('id', existingResponse.id);

      if (error) {
        console.error("Error updating response:", error);
        throw error;
      }
    } else {
      // Create new response
      const { error } = await supabase
        .from(tableName)
        .insert([{ 
          questionnaire_type: questionnaireId, 
          question_id: questionId, 
          user_id: userId, 
          response 
        }]);

      if (error) {
        console.error("Error creating response:", error);
        throw error;
      }
    }
  } catch (err) {
    console.error("Failed to save response:", err);
    throw err;
  }
};
