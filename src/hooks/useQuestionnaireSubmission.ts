import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type QuestionnaireType = "general_opinion" | "life_support" | "advanced_illness" | "preferences";

export function useQuestionnaireSubmission(questionnaireType: QuestionnaireType) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const session = useSession();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log(`Mise à jour de la réponse pour la question ${questionId}:`, value);
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async (onSuccess?: () => void) => {
    if (!session?.user?.id) {
      console.error('Aucune session utilisateur trouvée');
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
      const answerPromises = Object.entries(answers).map(([questionId, answer]) => 
        supabase
          .from('questionnaire_answers')
          .upsert({
            user_id: session.user.id,
            questionnaire_type: questionnaireType,
            question_id: questionId,
            answer: answer
          }, {
            onConflict: 'user_id,questionnaire_type,question_id'
          })
      );

      const results = await Promise.all(answerPromises);
      const errors = results.filter(result => result.error);

      if (errors.length > 0) {
        console.error('Erreurs lors de la sauvegarde des réponses:', errors);
        throw new Error('Erreur lors de la sauvegarde des réponses');
      }

      // Mettre à jour la synthèse
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

      if (onSuccess) {
        onSuccess();
      }

      // Ajout d'un délai avant la navigation pour s'assurer que toutes les opérations sont terminées
      setTimeout(() => {
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