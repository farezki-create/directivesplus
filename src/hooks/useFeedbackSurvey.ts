
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface FeedbackQuestion {
  id: string;
  question_text: string;
  question_type: string; // Changed from union type to string to match Supabase
  options?: any;
  display_order: number;
  category: string;
}

export interface FeedbackResponse {
  question_id: string;
  response_value: string;
}

export const useFeedbackSurvey = () => {
  const [questions, setQuestions] = useState<FeedbackQuestion[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback_questions')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = data?.map(item => ({
        id: item.id,
        question_text: item.question_text,
        question_type: item.question_type,
        options: item.options,
        display_order: item.display_order,
        category: item.category
      })) || [];
      
      setQuestions(transformedData);
    } catch (error) {
      console.error('Error fetching feedback questions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le questionnaire",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const submitResponses = async () => {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utilisateur non connecté');

      const responsesToInsert = Object.entries(responses).map(([questionId, value]) => ({
        user_id: user.id,
        question_id: questionId,
        response_value: value
      }));

      const { error } = await supabase
        .from('feedback_responses')
        .insert(responsesToInsert);

      if (error) throw error;

      toast({
        title: "Merci !",
        description: "Votre avis a été enregistré avec succès"
      });

      return true;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre avis",
        variant: "destructive"
      });
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const updateResponse = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return {
    questions,
    responses,
    loading,
    submitting,
    updateResponse,
    submitResponses
  };
};
