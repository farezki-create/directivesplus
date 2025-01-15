import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QuestionnaireType, getResponseTableName } from "@/types/questionnaire";

export function useQuestionnaireSubmission(questionnaireType: QuestionnaireType) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log(`Mise à jour de la réponse pour la question ${questionId}:`, value);
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      console.error('Aucune session utilisateur trouvée');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos réponses."
      });
      return;
    }

    setIsSubmitting(true);
    console.log('Début de la sauvegarde des réponses');

    try {
      const tableName = getResponseTableName(questionnaireType);
      console.log('Sauvegarde des réponses dans la table:', tableName);
      
      // Sauvegarder les réponses individuelles
      for (const [questionId, response] of Object.entries(answers)) {
        const { error } = await supabase
          .from(tableName)
          .upsert({
            user_id: session.user.id,
            question_id: questionId,
            response: response
          }, {
            onConflict: 'user_id, question_id'
          });

        if (error) {
          console.error('Erreur lors de la sauvegarde de la réponse:', error);
          throw error;
        }
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

      console.log('Sauvegarde réussie, affichage du toast de succès');
      toast({
        title: "Réponses enregistrées",
        description: "Vos réponses ont été sauvegardées avec succès."
      });

    } catch (error) {
      console.error('Erreur lors de la sauvegarde des réponses:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de vos réponses."
      });
    } finally {
      console.log('Réinitialisation de isSubmitting');
      setIsSubmitting(false);
    }
  };

  return {
    answers,
    isSubmitting,
    handleAnswerChange,
    handleSubmit
  };
}