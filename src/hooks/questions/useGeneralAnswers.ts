
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/language/useLanguage";

export function useGeneralAnswers(questions: any[]) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const handleAnswerChange = (questionId: string, value: string, checked: boolean) => {
    console.log('[GeneralOpinion] Answer change:', { questionId, value, checked });
    
    setAnswers(prev => {
      // For checkbox behavior, we need to handle the checked state differently
      if (checked) {
        // If checked, add the value to the array if not already present
        return {
          ...prev,
          [questionId]: [value]
        };
      } else {
        // If unchecked, remove the value from the array
        return {
          ...prev,
          [questionId]: prev[questionId]?.filter(v => v !== value) || []
        };
      }
    });
  };

  const handleSubmit = async (onSuccess: () => void) => {
    try {
      console.log('[GeneralOpinion] Submitting answers:', answers);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error('[GeneralOpinion] No user ID found');
        toast({
          title: currentLanguage === 'fr' ? "Erreur" : "Error",
          description: currentLanguage === 'fr'
            ? "Vous devez être connecté pour enregistrer vos réponses."
            : "You must be logged in to save your answers.",
          variant: "destructive",
        });
        return;
      }

      // Prepare all responses for insertion
      const responses = Object.entries(answers).flatMap(([questionId, values]) => {
        const question = questions.find(q => q.id === questionId);
        const questionText = currentLanguage === 'en' 
          ? question?.question 
          : question?.Question;
        
        return values.map(value => ({
          user_id: userId,
          question_id: questionId,
          question_text: questionText,
          response: value
        }));
      });

      console.log('[GeneralOpinion] Prepared responses for insertion:', responses);

      if (responses.length === 0) {
        toast({
          title: currentLanguage === 'fr' ? "Attention" : "Warning",
          description: currentLanguage === 'fr'
            ? "Veuillez sélectionner au moins une réponse."
            : "Please select at least one answer.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('questionnaire_general_responses')
        .upsert(responses, {
          onConflict: 'user_id,question_id'
        });

      if (error) {
        console.error('[GeneralOpinion] Error saving responses:', error);
        toast({
          title: currentLanguage === 'fr' ? "Erreur" : "Error",
          description: currentLanguage === 'fr'
            ? "Impossible d'enregistrer vos réponses. Veuillez réessayer."
            : "Unable to save your answers. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('[GeneralOpinion] Responses saved successfully');
      toast({
        title: currentLanguage === 'fr' ? "Succès" : "Success",
        description: currentLanguage === 'fr'
          ? "Vos réponses ont été enregistrées."
          : "Your answers have been saved.",
      });
      onSuccess();
    } catch (error) {
      console.error('[GeneralOpinion] Unexpected error during submission:', error);
      toast({
        title: currentLanguage === 'fr' ? "Erreur" : "Error",
        description: currentLanguage === 'fr'
          ? "Une erreur inattendue s'est produite lors de l'enregistrement."
          : "An unexpected error occurred while saving.",
        variant: "destructive",
      });
    }
  };

  return { answers, handleAnswerChange, handleSubmit };
}
