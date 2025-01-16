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
      console.log(`Chargement des questions ${questionnaireType}...`);
      const { data, error } = await supabase
        .from(questionnaireType === 'general_opinion' ? 'questions' : `${questionnaireType}_questions`)
        .select('*')
        .order('order', { ascending: true });

      if (error) {
        console.error(`Erreur lors du chargement des questions ${questionnaireType}:`, error);
        throw error;
      }

      console.log(`Questions ${questionnaireType} chargées:`, data);
      setQuestions(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les questions."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log(`Mise à jour de la réponse pour la question ${questionId}:`, value);
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const loadExistingAnswers = (existingAnswers: any[] | null) => {
    if (existingAnswers && existingAnswers.length > 0) {
      console.log('Chargement des réponses existantes:', existingAnswers);
      const answersMap: Record<string, string> = {};
      existingAnswers.forEach(answer => {
        if (answer.question_id) {
          answersMap[answer.question_id] = answer.answer;
        }
      });
      setAnswers(answersMap);
    }
  };

  const handleSubmit = async (onSuccess?: () => void) => {
    if (!session?.user?.id) {
      console.error('No user session found');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Vous devez être connecté pour enregistrer vos réponses."
      });
      return;
    }

    try {
      console.log('Enregistrement des réponses:', answers);
      
      // Préparer les données pour l'insertion
      const answersToInsert = Object.entries(answers).map(([questionId, answer]) => ({
        user_id: session.user.id,
        questionnaire_type: questionnaireType,
        question_id: questionId,
        answer: answer
      }));

      // Insérer toutes les réponses en une seule opération
      const { error } = await supabase
        .from('questionnaire_answers')
        .upsert(answersToInsert, {
          onConflict: 'user_id, questionnaire_type, question_id'
        });

      if (error) {
        console.error('Erreur lors de la sauvegarde des réponses:', error);
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
        console.error('Erreur lors de la mise à jour de la synthèse:', synthesisError);
        throw synthesisError;
      }

      console.log('Réponses sauvegardées avec succès');
      toast({
        title: "Réponses enregistrées",
        description: "Vos réponses ont été sauvegardées avec succès."
      });

      if (onSuccess) {
        onSuccess();
      }
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
    questions,
    loading,
    answers,
    fetchQuestions,
    handleAnswerChange,
    handleSubmit,
    loadExistingAnswers
  };
}