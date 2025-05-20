
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getResponseTable } from '@/components/questionnaire/utils';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to fetch saved questionnaire responses
 */
export const useFetchResponses = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fetchResponses = async (questionnaireType: string | undefined) => {
    if (!questionnaireType) return {};
    
    setLoading(true);
    setError(null);
    
    try {
      const responseTable = getResponseTable(questionnaireType);
      
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No authenticated user found");
        return {};
      }
      
      let query = supabase
        .from(responseTable as any)
        .select('question_id, response')
        .eq('user_id', user.id);
      
      // Add questionnaire_type filter only for the table that has this column
      if (responseTable === 'questionnaire_responses') {
        query = query.eq('questionnaire_type', questionnaireType);
      }
      
      const { data, error: responsesError } = await query;
      
      if (responsesError) throw responsesError;
      
      // Convert responses array to object with strong validation
      const responsesObj: Record<string, string> = {};
      
      if (data && Array.isArray(data)) {
        data.forEach((item: any) => {
          if (item && typeof item === 'object' && 'question_id' in item && 'response' in item) {
            responsesObj[item.question_id] = item.response;
          }
        });
      }
      
      return responsesObj;
    } catch (err: any) {
      console.error('Error fetching responses:', err);
      setError('Erreur lors du chargement des réponses.');
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger vos réponses sauvegardées.",
        variant: "destructive"
      });
      return {};
    } finally {
      setLoading(false);
    }
  };
  
  return {
    fetchResponses,
    loading,
    error
  };
};
