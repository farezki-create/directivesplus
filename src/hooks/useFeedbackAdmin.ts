
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface FeedbackSummary {
  question_id: string;
  question_text: string;
  question_type: string;
  category: string;
  responses: Array<{
    response_value: string;
    count: number;
    percentage: number;
  }>;
  total_responses: number;
}

export interface DetailedResponse {
  id: string;
  user_id: string;
  question_text: string;
  response_value: string;
  created_at: string;
  category: string;
}

export const useFeedbackAdmin = () => {
  const [summary, setSummary] = useState<FeedbackSummary[]>([]);
  const [detailedResponses, setDetailedResponses] = useState<DetailedResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbackSummary = async () => {
    try {
      setLoading(true);
      
      // Récupérer toutes les questions et leurs réponses
      const { data: questionsData, error: questionsError } = await supabase
        .from('feedback_questions')
        .select(`
          id,
          question_text,
          question_type,
          category,
          feedback_responses(response_value)
        `);

      if (questionsError) throw questionsError;

      // Calculer les statistiques pour chaque question
      const summaryData = questionsData?.map(question => {
        const responses = question.feedback_responses || [];
        const total = responses.length;
        
        // Compter les réponses par valeur
        const responseCounts = responses.reduce((acc: Record<string, number>, response: any) => {
          const value = response.response_value;
          acc[value] = (acc[value] || 0) + 1;
          return acc;
        }, {});

        // Convertir en format avec pourcentages
        const responseStats = Object.entries(responseCounts).map(([value, count]) => ({
          response_value: value,
          count: count as number,
          percentage: total > 0 ? Math.round((count as number / total) * 100) : 0
        }));

        return {
          question_id: question.id,
          question_text: question.question_text,
          question_type: question.question_type,
          category: question.category,
          responses: responseStats,
          total_responses: total
        };
      }) || [];

      setSummary(summaryData);

    } catch (error) {
      console.error('Error fetching feedback summary:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le résumé des avis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('feedback_responses')
        .select(`
          id,
          user_id,
          response_value,
          created_at,
          feedback_questions(
            question_text,
            category
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const detailedData = data?.map(response => ({
        id: response.id,
        user_id: response.user_id,
        question_text: response.feedback_questions?.question_text || '',
        response_value: response.response_value,
        created_at: response.created_at,
        category: response.feedback_questions?.category || ''
      })) || [];

      setDetailedResponses(detailedData);

    } catch (error) {
      console.error('Error fetching detailed responses:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réponses détaillées",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchFeedbackSummary();
    fetchDetailedResponses();
  }, []);

  return {
    summary,
    detailedResponses,
    loading,
    refetch: () => {
      fetchFeedbackSummary();
      fetchDetailedResponses();
    }
  };
};
