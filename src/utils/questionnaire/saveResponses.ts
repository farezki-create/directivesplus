
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

    // Vérifier explicitement la session de l'utilisateur
    console.log(`[${questionnaireType}] Vérification de la session utilisateur...`);
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error(`[${questionnaireType}] Erreur lors de la récupération de la session:`, sessionError);
      toast({
        title: language === 'en' ? "Error" : "Erreur",
        description: language === 'en' 
          ? "Unable to verify your session. Please try logging in again." 
          : "Impossible de vérifier votre session. Veuillez vous reconnecter.",
        variant: "destructive",
      });
      return false;
    }
    
    if (!session) {
      console.error(`[${questionnaireType}] Aucune session active trouvée`);
      toast({
        title: language === 'en' ? "Error" : "Erreur",
        description: language === 'en' 
          ? "Your session has expired. Please log in again." 
          : "Votre session a expiré. Veuillez vous reconnecter.",
        variant: "destructive",
      });
      return false;
    }

    console.log(`[${questionnaireType}] Session utilisateur valide. Préparation des réponses...`);

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

    console.log(`[${questionnaireType}] Préparé ${responses.length} réponses pour insertion:`, responses);

    // Delete existing responses before inserting new ones
    console.log(`[${questionnaireType}] Suppression des anciennes réponses...`);
    const { error: deleteError } = await supabase
      .from('questionnaire_responses')
      .delete()
      .eq('user_id', userId)
      .eq('questionnaire_type', questionnaireType);

    if (deleteError) {
      console.error(`[${questionnaireType}] Erreur lors de la suppression des anciennes réponses:`, deleteError);
      throw deleteError;
    }

    console.log(`[${questionnaireType}] Anciennes réponses supprimées avec succès. Insertion des nouvelles réponses...`);

    // Insert all responses in a single batch instead of one by one
    const { error: insertError } = await supabase
      .from('questionnaire_responses')
      .insert(responses);

    if (insertError) {
      console.error(`[${questionnaireType}] Erreur lors de l'enregistrement des réponses:`, insertError);
      
      // Vérification spécifique pour les erreurs RLS
      if (insertError.message?.includes('policy') || insertError.message?.includes('violates row-level security')) {
        console.error(`[${questionnaireType}] Erreur de politique RLS détectée - vérifiez que user_id correspond à auth.uid()`);
        toast({
          title: language === 'en' ? "Permission Error" : "Erreur de permission",
          description: language === 'en'
            ? "You don't have permission to save these answers. Please try logging in again."
            : "Vous n'avez pas la permission d'enregistrer ces réponses. Veuillez vous reconnecter.",
          variant: "destructive",
        });
        return false;
      }
      
      throw insertError;
    }

    console.log(`[${questionnaireType}] Toutes les ${responses.length} réponses ont été enregistrées avec succès`);
    toast({
      title: language === 'en' ? "Success" : "Succès",
      description: language === 'en'
        ? "Your answers have been saved."
        : "Vos réponses ont été enregistrées.",
    });
    return true;
  } catch (error) {
    console.error(`[${questionnaireType}] Erreur inattendue pendant l'enregistrement:`, error);
    toast({
      title: language === 'en' ? "Error" : "Erreur",
      description: language === 'en'
        ? "An unexpected error occurred while saving. Please try again later."
        : "Une erreur inattendue s'est produite lors de l'enregistrement. Veuillez réessayer plus tard.",
      variant: "destructive",
    });
    return false;
  }
}
