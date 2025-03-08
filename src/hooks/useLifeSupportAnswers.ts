
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export function useLifeSupportAnswers(questions: any[]) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const handleAnswerChange = (questionId: string, value: string, checked: boolean) => {
    console.log('[LifeSupport] Answer change:', { questionId, value, checked });
    
    setAnswers(prev => {
      if (checked) {
        return {
          ...prev,
          [questionId]: [value]
        };
      } 
      else {
        const newValues = prev[questionId]?.filter(v => v !== value) || [];
        return {
          ...prev,
          [questionId]: newValues
        };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      console.log('[LifeSupport] Submitting answers:', answers);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error('[LifeSupport] No user ID found');
        toast({
          title: currentLanguage === 'en' ? "Error" : "Erreur",
          description: currentLanguage === 'en'
            ? "You must be logged in to save your answers."
            : "Vous devez être connecté pour enregistrer vos réponses.",
          variant: "destructive",
        });
        return false;
      }

      const responses = Object.entries(answers).flatMap(([questionId, values]) => {
        const question = questions.find(q => q.id.toString() === questionId);
        return values.map(value => ({
          user_id: userId,
          question_id: questionId,
          question_text: question?.question,
          response: value,
          questionnaire_type: 'life_support'
        }));
      });

      console.log('[LifeSupport] Prepared responses for insertion:', responses);

      const { error } = await supabase
        .from('questionnaire_responses')
        .upsert(responses, {
          onConflict: 'user_id,question_id,questionnaire_type'
        });

      if (error) {
        console.error('[LifeSupport] Error saving responses:', error);
        toast({
          title: currentLanguage === 'en' ? "Error" : "Erreur",
          description: currentLanguage === 'en'
            ? "Unable to save your answers. Please try again."
            : "Impossible d'enregistrer vos réponses. Veuillez réessayer.",
          variant: "destructive",
        });
        return false;
      }

      console.log('[LifeSupport] Responses saved successfully');
      toast({
        title: currentLanguage === 'en' ? "Success" : "Succès",
        description: currentLanguage === 'en'
          ? "Your answers have been saved."
          : "Vos réponses ont été enregistrées.",
      });
      return true;
    } catch (error) {
      console.error('[LifeSupport] Unexpected error during submission:', error);
      toast({
        title: currentLanguage === 'en' ? "Error" : "Erreur",
        description: currentLanguage === 'en'
          ? "An unexpected error occurred during submission."
          : "Une erreur inattendue s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { answers, handleAnswerChange, handleSubmit };
}
