
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
      
      let query = supabase
        .from(responseTable as any)
        .select('question_id, response')
        .eq('user_id', user.id);
      
      // Ajouter le filtre questionnaire_type uniquement pour la table qui a cette colonne
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
      
      // Delete existing responses for this user
      let deleteQuery = supabase
        .from(responseTable as any)
        .delete()
        .eq('user_id', user.id);
        
      // Ajouter le filtre questionnaire_type uniquement pour la table qui a cette colonne
      if (responseTable === 'questionnaire_responses') {
        deleteQuery = deleteQuery.eq('questionnaire_type', questionnaireType);
      }
      
      const { error: deleteError } = await deleteQuery;
      
      if (deleteError) throw deleteError;
      
      // Prepare responses to save
      const responsesToSave: any[] = [];
      
      // Create properly typed response objects
      Object.entries(responses).forEach(([questionId, response]) => {
        if (response) { // Only save non-empty responses
          const question = questions.find(q => q.id === questionId);
          const questionText = question ? question.question : '';
          
          const responseObject: any = {
            question_id: questionId,
            response,
            question_text: questionText,
            user_id: user.id
          };
          
          // Add questionnaire_type field only for the table that needs it
          if (responseTable === 'questionnaire_responses') {
            responseObject.questionnaire_type = questionnaireType;
          }
          
          responsesToSave.push(responseObject);
        }
      });
      
      // Debug info
      console.log("Réponses à enregistrer:", responsesToSave);
      
      // Ensure all question_id values are UUIDs for questionnaire_responses table
      if (responseTable === 'questionnaire_responses') {
        for (const response of responsesToSave) {
          // If the question_id is numeric, convert it to string to avoid PostgreSQL UUID type errors
          if (!isNaN(response.question_id)) {
            // Create a UUID format for numeric IDs to satisfy PostgreSQL's UUID requirements
            response.question_id = `00000000-0000-0000-0000-${response.question_id.toString().padStart(12, '0')}`;
          }
        }
      }
      
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
