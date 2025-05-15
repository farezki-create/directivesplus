
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getResponseTable } from '@/components/questionnaire/utils';
import { toast } from '@/hooks/use-toast';

export type QuestionnaireResponse = {
  question_id: string;
  response: string;
};

/**
 * Hook to fetch saved questionnaire responses
 * @param questionnaireType The type of questionnaire
 * @returns Object containing responses and loading state
 */
export const useQuestionnaireResponses = (questionnaireType: string | undefined) => {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchResponses = async () => {
    if (!questionnaireType) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const responseTable = getResponseTable(questionnaireType);
      
      // Récupérer l'utilisateur authentifié
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("Aucun utilisateur authentifié trouvé");
        return;
      }
      
      const { data, error: responsesError } = await supabase
        .from(responseTable as any)
        .select('question_id, response')
        .eq('questionnaire_type', questionnaireType)
        .eq('user_id', user.id);
      
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
      
      setResponses(responsesObj);
    } catch (err: any) {
      console.error('Error fetching responses:', err);
      setError('Erreur lors du chargement des réponses.');
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger vos réponses sauvegardées.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Save responses to the database
   * @param responses Object containing question_id as keys and responses as values
   * @param questions Array of questions with their text content
   * @returns Promise resolving to success status
   */
  const saveResponses = async (
    responses: Record<string, string>,
    questions: { id: string; question: string }[]
  ): Promise<boolean> => {
    if (!questionnaireType) return false;
    
    setLoading(true);
    
    try {
      const responseTable = getResponseTable(questionnaireType);
      
      // Récupérer l'utilisateur authentifié
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("Aucun utilisateur authentifié pour enregistrer les réponses");
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer vos réponses.",
          variant: "destructive"
        });
        return false;
      }
      
      console.log("Utilisateur authentifié:", user.id);
      
      // Delete existing responses for this questionnaire type and user
      const { error: deleteError } = await supabase
        .from(responseTable as any)
        .delete()
        .eq('questionnaire_type', questionnaireType)
        .eq('user_id', user.id);
      
      if (deleteError) throw deleteError;
      
      // Prepare responses to save
      const responsesToSave: any[] = [];
      
      // Create properly typed response objects
      Object.entries(responses).forEach(([questionId, response]) => {
        if (response) { // Only save non-empty responses
          const question = questions.find(q => q.id === questionId);
          const questionText = question ? question.question : '';
          
          responsesToSave.push({
            question_id: questionId,
            response,
            questionnaire_type: questionnaireType,
            question_text: questionText,
            user_id: user.id
          });
        }
      });
      
      // Debug info
      console.log("Réponses à enregistrer:", responsesToSave);
      
      // Insert new responses if there are any to save
      if (responsesToSave.length > 0) {
        const { error: insertError } = await supabase
          .from(responseTable as any)
          .insert(responsesToSave);
        
        if (insertError) throw insertError;
      }
      
      // Update local state
      setResponses(responses);
      
      toast({
        title: "Réponses enregistrées",
        description: "Vos réponses ont été sauvegardées avec succès."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error saving responses:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de vos réponses.",
        variant: "destructive"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    responses,
    loading,
    error,
    fetchResponses,
    saveResponses,
    setResponses
  };
};
