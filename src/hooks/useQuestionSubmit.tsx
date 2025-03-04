
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Question } from "./useQuestionsData";

export function useQuestionSubmit(questions: Question[], currentLanguage: string) {
  const { toast } = useToast();

  const handleSubmit = async (answers: Record<string, string[]>, onSuccess: () => void) => {
    try {
      console.log('[GeneralOpinion] Submitting answers:', answers);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error('[GeneralOpinion] No user ID found');
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer vos réponses.",
          variant: "destructive",
        });
        return;
      }

      // Prepare all responses for insertion
      const responses = Object.entries(answers).flatMap(([questionId, values]) => {
        const question = questions.find(q => q.id === questionId);
        const questionText = currentLanguage === 'en' ? question?.question : question?.Question || question?.question;
        
        return values.map(value => ({
          user_id: userId,
          question_id: questionId,
          question_text: questionText,
          response: value
        }));
      });

      console.log('[GeneralOpinion] Prepared responses for insertion:', responses);

      const { error } = await supabase
        .from('questionnaire_general_responses')
        .upsert(responses, {
          onConflict: 'user_id,question_id'
        });

      if (error) {
        console.error('[GeneralOpinion] Error saving responses:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer vos réponses. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      console.log('[GeneralOpinion] Responses saved successfully');
      toast({
        title: "Succès",
        description: "Vos réponses ont été enregistrées.",
      });
      onSuccess();
    } catch (error) {
      console.error('[GeneralOpinion] Unexpected error during submission:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  return handleSubmit;
}
