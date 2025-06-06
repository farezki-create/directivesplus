
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { getResponseTable } from "./utils";

/**
 * Type for responses to save to the database
 */
type ResponseToSave = {
  question_id: string;
  response: string;
  questionnaire_type: string;
  question_text: string;
  user_id: string;
};

/**
 * Save responses to the database
 * @param questionnaireType The type of questionnaire
 * @param responses Object containing question_id as keys and responses as values
 * @param questions Array of questions with their text content
 * @returns Promise resolving to success status
 */
export const saveResponses = async (
  questionnaireType: string, 
  responses: Record<string, string>,
  questions: { id: string; question: string }[]
): Promise<boolean> => {
  try {
    const responseTable = getResponseTable(questionnaireType);
    
    // Récupérer l'utilisateur authentifié
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Aucun utilisateur authentifié pour enregistrer les réponses");
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos réponses.",
        variant: "destructive"
      });
      return false;
    }
    
    // Delete existing responses for this questionnaire type and user
    const { error: deleteError } = await supabase
      .from(responseTable as any)
      .delete()
      .eq('questionnaire_type', questionnaireType)
      .eq('user_id', user.id);
    
    if (deleteError) throw deleteError;
    
    // Prepare responses to save
    const responsesToSave: ResponseToSave[] = [];
    
    // Create properly typed response objects
    Object.entries(responses).forEach(([questionId, response]) => {
      if (response) { // Only save non-empty responses
        const question = questions.find(q => q.id === questionId);
        const questionText = question ? question.question : '';
        
        responsesToSave.push({
          question_id: questionId,
          response,
          questionnaire_type: questionnaireType,
          question_text: questionText,
          user_id: user.id
        });
      }
    });
    
    // Insert new responses if there are any to save
    if (responsesToSave.length > 0) {
      const { error: insertError } = await supabase
        .from(responseTable as any)
        .insert(responsesToSave);
      
      if (insertError) throw insertError;
    }
    
    toast({
      title: "Réponses enregistrées",
      description: "Vos réponses ont été sauvegardées avec succès."
    });
    
    return true;
  } catch (error: any) {
    console.error('Error saving responses:', error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'enregistrement de vos réponses.",
      variant: "destructive"
    });
    return false;
  }
};

/**
 * Get saved responses from the database
 * @param questionnaireType The type of questionnaire
 * @returns Promise resolving to an object with question_id as keys and responses as values
 */
export const getSavedResponses = async (
  questionnaireType: string
): Promise<Record<string, string>> => {
  try {
    const responseTable = getResponseTable(questionnaireType);
    
    // Récupérer l'utilisateur authentifié
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("Aucun utilisateur authentifié trouvé");
      return {};
    }
    
    const { data, error: responsesError } = await supabase
      .from(responseTable as any)
      .select('question_id, response')
      .eq('questionnaire_type', questionnaireType)
      .eq('user_id', user.id);
    
    if (responsesError) throw responsesError;
    
    // Convert responses array to object
    const responsesObj: Record<string, string> = {};
    
    // First check if data exists and is an array
    if (data && Array.isArray(data)) {
      // Then check if each item in the array has the expected properties
      data.forEach((item: any) => {
        if (item && typeof item === 'object' && 'question_id' in item && 'response' in item) {
          responsesObj[item.question_id] = item.response;
        }
      });
    }
    
    return responsesObj;
  } catch (error: any) {
    console.error('Error fetching saved responses:', error);
    toast({
      title: "Erreur de chargement",
      description: "Impossible de charger vos réponses sauvegardées.",
      variant: "destructive"
    });
    return {};
  }
};
