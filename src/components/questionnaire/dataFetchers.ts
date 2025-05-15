
import { supabase } from "@/integrations/supabase/client";
import { QuestionType, ResponseType } from "./types";

// Tables mapping for different questionnaire types
const sectionTableMap: Record<string, string> = {
  "avis-general": "questionnaire_general_fr",
  "maintien-vie": "questionnaire_life_support_fr",
  "maladie-avancee": "questionnaire_advanced_illness_fr",
  "gouts-peurs": "questionnaire_preferences_fr",
  "personne-confiance": "trusted_persons", // This would need specific handling
  "exemples-phrases": "questionnaire_examples_fr", // Verify this table exists
  "synthese": "questionnaire_synthesis"
};

// Get the appropriate table name based on the section ID
export function getSectionTable(sectionId: string): string {
  if (!sectionTableMap[sectionId]) {
    console.warn(`No table mapping found for section: ${sectionId}, defaulting to general`);
    return sectionTableMap["avis-general"];
  }
  return sectionTableMap[sectionId];
}

// Fetch questions from the appropriate table
export async function fetchQuestions(sectionId: string): Promise<QuestionType[]> {
  try {
    const tableName = getSectionTable(sectionId);
    console.log(`Fetching questions from table: ${tableName}`);

    const { data, error } = await supabase
      .from(tableName)
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
      const result: QuestionType[] = [];
      
      for (const item of data) {
        // Explicitly type the item for life support questions
        const question: QuestionType = {
          id: String(item.id),
          question: item.question_text,
          explanation: item.explanation || "",
          display_order: item.question_order || 0,
          options: {
            yes: item.option_yes,
            no: item.option_no,
            unsure: item.option_unsure
          }
        };
        
        result.push(question);
      }
      
      return result;
    } else {
      // Handle standard questions
      const result: QuestionType[] = [];
      
      for (const item of data) {
        // Explicitly type the item for standard questions
        const question: QuestionType = {
          id: String(item.id),
          question: item.question,
          explanation: item.explanation || "",
          display_order: item.display_order || 0
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

// Fetch saved responses for a user
export async function fetchResponses(
  sectionId: string,
  userId: string | undefined
): Promise<Record<string, string>> {
  if (!userId) {
    console.warn("No user ID provided for fetching responses");
    return {};
  }

  try {
    const tableName = getSectionTable(sectionId);
    const questionnaire_type = sectionId;
    
    console.log(`Fetching responses for user ${userId} and section ${sectionId}`);
    
    const { data, error } = await supabase
      .from("questionnaire_responses")
      .select("question_id, response")
      .eq("user_id", userId)
      .eq("questionnaire_type", questionnaire_type);

    if (error) {
      throw error;
    }

    // Using a simple object to store responses instead of complex array operations
    const responses: Record<string, string> = {};
    
    if (data && data.length > 0) {
      for (const item of data) {
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
