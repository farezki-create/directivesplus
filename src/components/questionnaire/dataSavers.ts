
import { supabase } from "@/integrations/supabase/client";
import { Question } from "./types";
import { toast } from "@/hooks/use-toast";
import { getResponseTable } from "./dataFetchers";

// Define a simple response object type to avoid complex type inference
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
  
  // Create a basic array with explicit typing
  const responsesToSave: SimpleResponseObject[] = [];
  
  // Process responses using a traditional for-in loop with Object.keys
  const keys = Object.keys(responses);
  for (let i = 0; i < keys.length; i++) {
    const questionId = keys[i];
    const responseValue = responses[questionId];
    
    // Find question text using simple loop
    let questionText = '';
    for (let j = 0; j < questions.length; j++) {
      if (questions[j].id === questionId) {
        questionText = questions[j].question;
        break;
      }
    }
    
    // Create a simple object and add it to the array
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
    const { error: insertError } = await supabase
      .from(responseTable)
      .insert(responsesToSave);
    
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
