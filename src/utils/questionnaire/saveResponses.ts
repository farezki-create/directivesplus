
import { supabase } from "@/integrations/supabase/client";
import { toast as showToast } from "@/hooks/use-toast";

interface SaveResponsesOptions {
  userId: string | undefined;
  answers: Record<string, string[]>;
  questions: any[];
  questionnaireType: 'general_opinion' | 'life_support' | 'advanced_illness' | 'preferences';
  toast: typeof showToast;
  language: 'en' | 'fr';
}

export async function saveResponses({
  userId,
  answers,
  questions,
  questionnaireType,
  toast,
  language
}: SaveResponsesOptions): Promise<boolean> {
  try {
    if (!userId) {
      console.error(`[${questionnaireType}] No user ID found`);
      toast({
        title: language === 'en' ? "Error" : "Erreur",
        description: language === 'en' 
          ? "You must be logged in to save your answers." 
          : "Vous devez être connecté pour enregistrer vos réponses.",
        variant: "destructive",
      });
      return false;
    }

    if (Object.keys(answers).length === 0) {
      console.log(`[${questionnaireType}] No answers to save`);
      toast({
        title: language === 'en' ? "Error" : "Erreur",
        description: language === 'en'
          ? "Please answer at least one question before saving."
          : "Veuillez répondre à au moins une question avant d'enregistrer.",
        variant: "destructive",
      });
      return false;
    }

    // Prepare all responses for insertion
    const responses = Object.entries(answers).flatMap(([questionId, values]) => {
      // Find the full question object to get correct ID format
      const question = questions.find(q => q.id.toString() === questionId);
      
      if (!question) {
        console.error(`[${questionnaireType}] Question with ID ${questionId} not found`);
        return [];
      }

      // Get the question text, prioritizing different properties based on available data
      const questionText = question.question_text || question.question || '';
      
      // Generate responses for each selected value
      return values.map(value => ({
        user_id: userId,
        question_id: question.id,
        question_text: questionText,
        response: value,
        questionnaire_type: questionnaireType
      }));
    });

    console.log(`[${questionnaireType}] Prepared responses for insertion:`, responses);

    // Delete existing responses before inserting new ones
    const { error: deleteError } = await supabase
      .from('questionnaire_responses')
      .delete()
      .eq('user_id', userId)
      .eq('questionnaire_type', questionnaireType);

    if (deleteError) {
      console.error(`[${questionnaireType}] Error deleting old responses:`, deleteError);
      throw deleteError;
    }

    // Insert new responses
    for (const response of responses) {
      const { error } = await supabase
        .from('questionnaire_responses')
        .insert(response);

      if (error) {
        console.error(`[${questionnaireType}] Error saving response:`, error);
        throw error;
      }
    }

    console.log(`[${questionnaireType}] All responses saved successfully`);
    toast({
      title: language === 'en' ? "Success" : "Succès",
      description: language === 'en'
        ? "Your answers have been saved."
        : "Vos réponses ont été enregistrées.",
    });
    return true;
  } catch (error) {
    console.error(`[${questionnaireType}] Unexpected error during submission:`, error);
    toast({
      title: language === 'en' ? "Error" : "Erreur",
      description: language === 'en'
        ? "An unexpected error occurred while saving."
        : "Une erreur inattendue s'est produite lors de l'enregistrement.",
      variant: "destructive",
    });
    return false;
  }
}
