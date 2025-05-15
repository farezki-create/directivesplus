
import { supabase } from "@/integrations/supabase/client";
import { Question } from "./types";
import { toast } from "@/hooks/use-toast";
import { getResponseTable } from "./dataFetchers";

// Define a simple response object type with explicit primitive types
type SimpleResponseObject = {
  question_id: string;
  response: string;
  questionnaire_type: string;
  user_id: string;
  question_text: string;
};

// Save user responses to the database
export async function saveResponses(
  pageId: string,
  userId: string,
  responses: Record<string, string>,
  questions: Question[]
): Promise<void> {
  console.log('Saving responses for pageId:', pageId);
  
  const responseTable = getResponseTable(pageId);
  
  // Create an array of response objects
  const responsesToSave: SimpleResponseObject[] = [];
  
  // Get all question IDs as an array
  const questionIds = Object.keys(responses);
  
  // Process each question ID
  for (let i = 0; i < questionIds.length; i++) {
    const questionId = questionIds[i];
    const responseValue = responses[questionId];
    
    // Find the matching question to get its text
    let questionText = '';
    for (let j = 0; j < questions.length; j++) {
      if (questions[j].id === questionId) {
        questionText = questions[j].question;
        break;
      }
    }
    
    // Add response to the array
    responsesToSave.push({
      question_id: questionId,
      response: responseValue,
      questionnaire_type: pageId,
      user_id: userId,
      question_text: questionText
    });
  }
  
  console.log('Responses to save:', responsesToSave);
  
  // Delete existing responses
  const { error: deleteError } = await supabase
    .from(responseTable)
    .delete()
    .eq('questionnaire_type', pageId)
    .eq('user_id', userId);
  
  if (deleteError) {
    console.error('Error deleting existing responses:', deleteError);
    throw deleteError;
  }
  
  // Only insert if there are responses to save
  if (responsesToSave.length > 0) {
    // Convert to plain JavaScript objects before inserting
    const plainResponses = responsesToSave.map(r => ({
      question_id: r.question_id,
      response: r.response,
      questionnaire_type: r.questionnaire_type,
      user_id: r.user_id,
      question_text: r.question_text
    }));
    
    // Use the plain array for insert operation
    const { error: insertError } = await supabase
      .from(responseTable)
      .insert(plainResponses);
    
    if (insertError) {
      console.error('Error inserting responses:', insertError);
      throw insertError;
    }
  }
  
  // Show success toast notification
  toast({
    title: "Réponses enregistrées",
    description: "Vos réponses ont été sauvegardées avec succès."
  });
}
