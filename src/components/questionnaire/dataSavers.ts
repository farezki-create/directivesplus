
import { supabase } from "@/integrations/supabase/client";
import { Question, Responses, ResponseData } from "./types";
import { toast } from "@/hooks/use-toast";
import { getResponseTable } from "./dataFetchers";

// Save user responses to the database
export async function saveResponses(
  pageId: string,
  userId: string,
  responses: Responses,
  questions: Question[]
): Promise<void> {
  console.log('Saving responses for pageId:', pageId);
  
  const responseTable = getResponseTable(pageId);
  
  // Create a simple array of any type first, then cast it later
  const responsesToSave: any[] = [];
  
  // Manually process each entry to avoid complex type inference
  const entries = Object.entries(responses);
  for (let i = 0; i < entries.length; i++) {
    const questionId = entries[i][0];
    const responseValue = entries[i][1];
    
    // Find the question text - simplified approach
    let questionText = '';
    for (let j = 0; j < questions.length; j++) {
      if (questions[j].id === questionId) {
        questionText = questions[j].question;
        break;
      }
    }
    
    // Add as plain object first
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
