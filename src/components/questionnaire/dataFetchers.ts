import { supabase } from "@/integrations/supabase/client";
import { UserResponse } from "./types";

// Fetch questionnaire responses for a specific user
export const fetchResponses = async (questionnaireId: string, userId: string): Promise<Record<string, UserResponse>> => {
  try {
    // Use a simpler approach with explicit type annotations to avoid excessive type instantiation
    const { data, error } = await supabase
      .from("user_responses")
      .select("*")
      .eq("questionnaire_id", questionnaireId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching responses:", error);
      throw error;
    }

    if (!data || data.length === 0) {
      return {};
    }

    // Create a simple response map with explicit typing
    const responseMap: Record<string, UserResponse> = {};
    
    // Use a normal for loop instead of complex type inference
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item && item.question_id) {
        responseMap[item.question_id] = {
          id: item.id,
          questionId: item.question_id,
          response: item.response,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
        };
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
): Promise<UserResponse | null> => {
  try {
    const { data: existingResponse, error: existingError } = await supabase
      .from("user_responses")
      .select("*")
      .eq("questionnaire_id", questionnaireId)
      .eq("question_id", questionId)
      .eq("user_id", userId)
      .single();

    if (existingError && existingError.code !== 'PGRST116') {
      console.error("Error checking existing response:", existingError);
      throw existingError;
    }

    if (existingResponse) {
      // Update existing response
      const { data, error } = await supabase
        .from("user_responses")
        .update({ response, updated_at: new Date() })
        .eq("id", existingResponse.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating response:", error);
        throw error;
      }

      return data as UserResponse;
    } else {
      // Create new response
      const { data, error } = await supabase
        .from("user_responses")
        .insert([{ questionnaire_id: questionnaireId, question_id: questionId, user_id: userId, response }])
        .select()
        .single();

      if (error) {
        console.error("Error creating response:", error);
        throw error;
      }

      return data as UserResponse;
    }
  } catch (err) {
    console.error("Failed to save response:", err);
    throw err;
  }
};
