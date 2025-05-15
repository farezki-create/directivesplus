
import { supabase } from "@/integrations/supabase/client";
import { Question, ResponseData } from "./types";
import { toast } from "@/hooks/use-toast";
import { getResponseTable } from "./dataFetchers";

// Save user responses to the database
export async function saveResponses(
  pageId: string,
  userId: string,
  responses: Record<string, string>,
  questions: Question[]
): Promise<void> {
  console.log('Saving responses for pageId:', pageId);
  
  const responseTable = getResponseTable(pageId);
  
  // Create a basic array without complex typing
  const responsesToSave = [];
  
  // Process each response entry with minimal type complexity
  for (const questionId in responses) {
    // Only process if the response has own property to avoid prototype chain issues
    if (Object.prototype.hasOwnProperty.call(responses, questionId)) {
      const responseValue = responses[questionId];
      
      // Find question text using simple loop
      let questionText = '';
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].id === questionId) {
          questionText = questions[i].question;
          break;
        }
      }
      
      // Add response as a plain object
      responsesToSave.push({
        question_id: questionId,
        response: responseValue,
        questionnaire_type: pageId,
        user_id: userId,
        question_text: questionText
      });
    }
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
