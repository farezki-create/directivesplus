
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { getResponseTable } from "./utils";

type ResponseToSave = {
  question_id: string;
  response: string;
  questionnaire_type: string;
  question_text: string;
  user_id: string;
};

export const saveResponses = async (
  questionnaireType: string, 
  responses: Record<string, string>,
  questions: { id: string; question: string }[]
): Promise<boolean> => {
  try {
    const responseTable = getResponseTable(questionnaireType);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Aucun utilisateur authentifié pour enregistrer les réponses");
      toast({ title: "Erreur", description: "Vous devez être connecté pour enregistrer vos réponses.", variant: "destructive" });
      return false;
    }
    
    const { error: deleteError } = await supabase.from(responseTable as any).delete().eq('questionnaire_type', questionnaireType).eq('user_id', user.id);
    if (deleteError) throw deleteError;
    
    const responsesToSave: ResponseToSave[] = [];
    Object.entries(responses).forEach(([questionId, response]) => {
      if (response) {
        const question = questions.find(q => q.id === questionId);
        responsesToSave.push({ question_id: questionId, response, questionnaire_type: questionnaireType, question_text: question ? question.question : '', user_id: user.id });
      }
    });
    
    if (responsesToSave.length > 0) {
      const { error: insertError } = await supabase.from(responseTable as any).insert(responsesToSave);
      if (insertError) throw insertError;
    }
    
    toast({ title: "Réponses enregistrées", description: "Vos réponses ont été sauvegardées avec succès." });
    return true;
  } catch (error: any) {
    console.error('Error saving responses:', error);
    toast({ title: "Erreur", description: "Une erreur est survenue lors de l'enregistrement de vos réponses.", variant: "destructive" });
    return false;
  }
};

export const getSavedResponses = async (questionnaireType: string): Promise<Record<string, string>> => {
  try {
    const responseTable = getResponseTable(questionnaireType);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return {};
    
    const { data, error: responsesError } = await supabase.from(responseTable as any).select('question_id, response').eq('questionnaire_type', questionnaireType).eq('user_id', user.id);
    if (responsesError) throw responsesError;
    
    const responsesObj: Record<string, string> = {};
    if (data && Array.isArray(data)) {
      data.forEach((item: any) => {
        if (item && typeof item === 'object' && 'question_id' in item && 'response' in item) {
          responsesObj[item.question_id] = item.response;
        }
      });
    }
    return responsesObj;
  } catch (error: any) {
    console.error('Error fetching saved responses:', error);
    toast({ title: "Erreur de chargement", description: "Impossible de charger vos réponses sauvegardées.", variant: "destructive" });
    return {};
  }
};
