
import { supabase } from "@/integrations/supabase/client";
import { Question, Responses } from "./types";
import { toast } from "@/components/ui/use-toast";
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
  
  // Using a simplified approach to avoid type inference issues
  const responsesToSave = [];
  
  // Manually build each response object to avoid type inference issues
  for (const [questionId, response] of Object.entries(responses)) {
    const questionText = questions.find(q => q.id === questionId)?.question || '';
    responsesToSave.push({
      question_id: questionId,
      response: response,
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
