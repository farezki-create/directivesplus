import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { QuestionnaireType } from "@/types/questionnaire";

export function useQuestionnaireState(questionnaireType: QuestionnaireType) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const session = useSession();
  const { toast } = useToast();

  const fetchQuestions = async () => {
    try {
      console.log(`[${questionnaireType}] Début du chargement des questions...`);
      const { data, error } = await supabase
        .from(questionnaireType === 'general_opinion' ? 'questions' : `${questionnaireType}_questions`)
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.error(`[${questionnaireType}] Erreur lors du chargement des questions:`, error);
        throw error;
      }

      console.log(`[${questionnaireType}] Questions chargées avec succès:`, data);
      setQuestions(data || []);
    } catch (error) {
      console.error(`[${questionnaireType}] Erreur inattendue:`, error);
    } finally {
      setLoading(false);
    }
  };

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

  const loadExistingAnswers = (existingAnswers: any[] | null) => {
    if (existingAnswers && existingAnswers.length > 0) {
      console.log(`[${questionnaireType}] Chargement des réponses existantes:`, existingAnswers);
      const answersMap: Record<string, string> = {};
      existingAnswers.forEach(answer => {
        if (answer.question_id) {
          answersMap[answer.question_id] = answer.answer;
        }
      });
      console.log(`[${questionnaireType}] Réponses existantes mappées:`, answersMap);
      setAnswers(answersMap);
    } else {
      console.log(`[${questionnaireType}] Aucune réponse existante trouvée`);
    }
  };

  const handleSubmit = async (onSuccess?: () => void) => {
    if (!session?.user?.id) {
      console.error(`[${questionnaireType}] Tentative de sauvegarde sans session utilisateur`);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos réponses."
      });
      return;
    }

    try {
      console.log(`[${questionnaireType}] Début de la sauvegarde des réponses:`, {
        userId: session.user.id,
        numberOfAnswers: Object.keys(answers).length,
        answers
      });

      // Préparer les données pour l'insertion
      const answersToInsert = Object.entries(answers).map(([questionId, answer]) => {
        console.log(`[${questionnaireType}] Préparation de la réponse:`, {
          questionId,
          answer
        });
        return {
          user_id: session.user.id,
          questionnaire_type: questionnaireType,
          question_id: questionId,
          answer: answer
        };
      });

      console.log(`[${questionnaireType}] Tentative d'insertion de ${answersToInsert.length} réponses`);

      // Insérer toutes les réponses en une seule opération
      const { data, error } = await supabase
        .from('questionnaire_answers')
        .upsert(answersToInsert, {
          onConflict: 'user_id, questionnaire_type, question_id'
        });

      if (error) {
        console.error(`[${questionnaireType}] Erreur lors de la sauvegarde des réponses:`, {
          error,
          payload: answersToInsert
        });
        throw error;
      }

      console.log(`[${questionnaireType}] Réponses sauvegardées avec succès:`, data);

      // Mettre à jour la synthèse
      console.log(`[${questionnaireType}] Mise à jour de la synthèse...`);
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

      console.log(`[${questionnaireType}] Processus de sauvegarde terminé avec succès`);
      toast({
        title: "Réponses enregistrées",
        description: "Vos réponses ont été sauvegardées avec succès."
      });

      if (onSuccess) {
        console.log(`[${questionnaireType}] Exécution du callback de succès`);
        onSuccess();
      }
    } catch (error) {
      console.error(`[${questionnaireType}] Erreur lors de la sauvegarde:`, error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de vos réponses."
      });
    }
  };

  return {
    questions,
    loading,
    answers,
    fetchQuestions,
    handleAnswerChange,
    handleSubmit,
    loadExistingAnswers
  };
}