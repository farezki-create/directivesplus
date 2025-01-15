import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useQuestionnaireSubmission() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (onSuccess?: () => void) => {
    if (!session?.user?.id) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos réponses."
      });
      return;
    }

    try {
      console.log('Saving answers:', answers);
      
      // Save individual answers
      for (const [questionId, answer] of Object.entries(answers)) {
        const { error } = await supabase
          .from('questionnaire_answers')
          .upsert({
            user_id: session.user.id,
            questionnaire_type: 'general_opinion',
            question_id: questionId,
            answer: answer
          }, {
            onConflict: 'user_id,questionnaire_type,question_id'
          });

        if (error) {
          console.error('Error saving answer:', error);
          throw error;
        }
      }

      // Update or create synthesis entry
      const { error: synthesisError } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: session.user.id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (synthesisError) {
        console.error('Error updating synthesis:', synthesisError);
        throw synthesisError;
      }

      toast({
        title: "Réponses enregistrées",
        description: "Vos réponses ont été sauvegardées avec succès."
      });

      // Navigate to synthesis page
      navigate('/free-text');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error saving answers:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de vos réponses."
      });
    }
  };

  return {
    answers,
    handleAnswerChange,
    handleSubmit
  };
}