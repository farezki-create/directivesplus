
import { supabase } from "@/integrations/supabase/client";
import { Question, Responses, QuestionnaireTableName, ResponseTableName } from "./types";

// Tables mapping for different questionnaire types
const sectionTableMap: Record<string, QuestionnaireTableName> = {
  "avis-general": "questionnaire_general_fr",
  "maintien-vie": "questionnaire_life_support_fr",
  "maladie-avancee": "questionnaire_advanced_illness_fr",
  "gouts-peurs": "questionnaire_preferences_fr",
  "personne-confiance": "trusted_persons", 
  "exemples-phrases": "questionnaire_examples_fr", // Make sure this matches a valid table in types.ts
  "synthese": "questionnaire_synthesis"
};

// Response tables mapping
const responseTableMap: Record<string, ResponseTableName> = {
  "avis-general": "questionnaire_responses",
  "maintien-vie": "questionnaire_responses",
  "maladie-avancee": "questionnaire_responses",
  "gouts-peurs": "questionnaire_preferences_responses",
  "personne-confiance": "questionnaire_responses",
  "exemples-phrases": "questionnaire_responses",
  "synthese": "questionnaire_responses"
};

// Get the appropriate table name based on the section ID
export function getSectionTable(sectionId: string): QuestionnaireTableName {
  if (!sectionTableMap[sectionId]) {
    console.warn(`No table mapping found for section: ${sectionId}, defaulting to general`);
    return "questionnaire_general_fr";
  }
  return sectionTableMap[sectionId];
}

// Get the appropriate response table name based on the section ID
export function getResponseTable(sectionId: string): ResponseTableName {
  if (!responseTableMap[sectionId]) {
    console.warn(`No response table mapping found for section: ${sectionId}, defaulting to general`);
    return "questionnaire_responses";
  }
  return responseTableMap[sectionId];
}

// Fetch questions from the appropriate table
export async function fetchQuestions(sectionId: string): Promise<Question[]> {
  try {
    const tableName = getSectionTable(sectionId);
    console.log(`Fetching questions from table: ${tableName}`);

    // Use type assertion to tell TypeScript this is a valid table name
    const { data, error } = await supabase
      .from(tableName as any)
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn(`No questions found for section ${sectionId}`);
      return [];
    }

    console.log(`Found ${data.length} questions for section ${sectionId}`);

    // Transform the questions based on the table type
    if (tableName === "questionnaire_life_support_fr") {
      // Handle life support questions specifically
      const result: Question[] = [];
      
      for (const item of data) {
        // Safely cast the item only after checking the table name
        const typedItem = item as unknown as {
          id: number;
          question_text: string;
          question_order: number;
          option_yes: string;
          option_no: string;
          option_unsure: string;
          explanation?: string;
        };
        
        const question: Question = {
          id: String(typedItem.id),
          question: typedItem.question_text,
          explanation: typedItem.explanation || "",
          display_order: typedItem.question_order || 0,
          options: {
            yes: typedItem.option_yes,
            no: typedItem.option_no,
            unsure: typedItem.option_unsure
          }
        };
        
        result.push(question);
      }
      
      return result;
    } else {
      // Handle standard questions
      const result: Question[] = [];
      
      for (const item of data) {
        // Safely cast the item for standard questions
        const typedItem = item as unknown as {
          id: string;
          question: string;
          explanation?: string;
          display_order?: number;
        };
        
        const question: Question = {
          id: String(typedItem.id),
          question: typedItem.question,
          explanation: typedItem.explanation || "",
          display_order: typedItem.display_order || 0
        };
        
        result.push(question);
      }
      
      return result;
    }
  } catch (err) {
    console.error("Failed to fetch questions:", err);
    throw new Error(`Failed to fetch questions: ${err instanceof Error ? err.message : String(err)}`);
  }
}

// Fetch saved responses for a user - fixing the infinite recursion issue
export async function fetchResponses(
  sectionId: string,
  userId: string | undefined
): Promise<Record<string, string>> {
  if (!userId) {
    console.warn("No user ID provided for fetching responses");
    return {};
  }

  try {
    const responseTable = getResponseTable(sectionId);
    
    console.log(`Fetching responses for user ${userId} and section ${sectionId}`);
    
    // Use type assertion here as well to avoid type issues with Supabase
    const { data, error } = await supabase
      .from(responseTable as any)
      .select("question_id, response")
      .eq("user_id", userId)
      .eq("questionnaire_type", sectionId);

    if (error) {
      throw error;
    }

    // Create a simple object to store responses to avoid recursion issues
    const responses: Record<string, string> = {};
    
    if (data && data.length > 0) {
      // Type-safe iteration over the data array
      for (let i = 0; i < data.length; i++) {
        // Use type assertion with unknown as an intermediate step for safety
        const item = data[i] as unknown as { question_id: string; response: string };
        responses[item.question_id] = item.response;
      }
    }
    
    console.log(`Found ${Object.keys(responses).length} saved responses`);
    return responses;
  } catch (err) {
    console.error("Failed to fetch responses:", err);
    return {};
  }
}
