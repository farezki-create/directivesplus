import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QuestionnaireType } from "@/types/questionnaire";

export function useQuestionnaireSubmission(questionnaireType: QuestionnaireType) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const session = useSession();
  const { toast } = useToast();

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log(`[${questionnaireType}] Mise à jour de la réponse:`, {
      questionId,
      value,
      previousValue: answers[questionId]
    });
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      console.error(`[${questionnaireType}] Tentative de sauvegarde sans session utilisateur`);
      throw new Error("Vous devez être connecté pour enregistrer vos réponses.");
    }

    setIsSubmitting(true);
    try {
      console.log(`[${questionnaireType}] Début de la sauvegarde des réponses:`, {
        userId: session.user.id,
        numberOfAnswers: Object.keys(answers).length,
        answers
      });

      // Préparer les données pour l'insertion
      const answersToInsert = Object.entries(answers).map(([questionId, answer]) => ({
        user_id: session.user.id,
        question_id: questionId,
        response: answer
      }));

      console.log(`[${questionnaireType}] Tentative d'insertion de ${answersToInsert.length} réponses`);

      const { error } = await supabase
        .from('questionnaire_general_responses')
        .upsert(answersToInsert, {
          onConflict: 'user_id, question_id'
        });

      if (error) {
        console.error(`[${questionnaireType}] Erreur lors de la sauvegarde des réponses:`, error);
        throw error;
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
        console.error(`[${questionnaireType}] Erreur lors de la mise à jour de la synthèse:`, synthesisError);
        throw synthesisError;
      }

      console.log(`[${questionnaireType}] Réponses sauvegardées avec succès`);
    } catch (error) {
      console.error(`[${questionnaireType}] Erreur lors de la sauvegarde:`, error);
      throw error;
    } finally {
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