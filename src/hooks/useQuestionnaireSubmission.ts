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
      console.log('Début de la sauvegarde des réponses:', answers);
      
      // Sauvegarder les réponses individuelles
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
          console.error('Erreur lors de la sauvegarde de la réponse:', error);
          throw error;
        }
      }

      // Mettre à jour ou créer l'entrée de synthèse
      const { error: synthesisError } = await supabase
        .from('questionnaire_synthesis')
        .upsert({
          user_id: session.user.id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (synthesisError) {
        console.error('Erreur lors de la mise à jour de la synthèse:', synthesisError);
        throw synthesisError;
      }

      console.log('Toutes les réponses ont été sauvegardées avec succès');

      toast({
        title: "Réponses enregistrées",
        description: "Vos réponses ont été sauvegardées avec succès."
      });

      // Exécuter le callback de succès si fourni
      if (onSuccess) {
        await onSuccess();
      }

      // Attendre un court instant avant la navigation
      setTimeout(() => {
        console.log('Navigation vers la page de synthèse');
        navigate('/free-text');
      }, 500);

    } catch (error) {
      console.error('Erreur lors de la sauvegarde des réponses:', error);
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