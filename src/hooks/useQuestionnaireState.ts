import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QuestionnaireAnswer, QuestionnaireType, getTableName } from "@/types/questionnaire";

export function useQuestionnaireState(questionnaireType: QuestionnaireType) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const session = useSession();
  const { toast } = useToast();

  const fetchQuestions = async () => {
    try {
      console.log(`Fetching ${questionnaireType} questions...`);
      const tableName = getTableName(questionnaireType);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('order', { ascending: true });
      
      if (error) {
        console.error('Error fetching questions:', error);
        return;
      }
      
      console.log(`Raw data from ${tableName} table:`, data);
      setQuestions(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log(`Updating answer for question ${questionId}:`, value);
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
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
      console.log('Saving answers:', answers);
      
      // Save individual answers
      for (const [questionId, answer] of Object.entries(answers)) {
        const { error } = await supabase
          .from('questionnaire_answers')
          .upsert({
            user_id: session.user.id,
            questionnaire_type: questionnaireType,
            question_id: questionId,
            answer: answer
          }, {
            onConflict: 'user_id, questionnaire_type, question_id'
          });

        if (error) {
          console.error('Error saving answer:', error);
          throw error;
        }
      }

      // Update synthesis
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

  const loadExistingAnswers = (existingAnswers: QuestionnaireAnswer[] | undefined) => {
    if (existingAnswers && existingAnswers.length > 0) {
      console.log('Loading existing answers:', existingAnswers);
      const answersMap: Record<string, string> = {};
      existingAnswers.forEach(answer => {
        if (answer.question_id) {
          answersMap[answer.question_id] = answer.answer;
        }
      });
      setAnswers(answersMap);
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