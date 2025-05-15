
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
  
  // Create an array to store our response data objects
  const responsesToSave: Array<ResponseData> = [];
  
  // Convert responses to array of objects with explicit typing
  const entries = Object.entries(responses);
  for (let i = 0; i < entries.length; i++) {
    const [questionId, responseValue] = entries[i];
    const question = questions.find(q => q.id === questionId);
    const questionText = question ? question.question : '';
    
    // Construct a new object with explicit type annotation
    const responseData: ResponseData = {
      question_id: questionId,
      response: responseValue,
      questionnaire_type: pageId,
      user_id: userId,
      question_text: questionText
    };
    
    responsesToSave.push(responseData);
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
