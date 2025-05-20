
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getResponseTable } from '@/components/questionnaire/utils';
import { toast } from '@/hooks/use-toast';
import { ResponseToSave } from './types';

/**
 * Hook for saving questionnaire responses
 */
export const useSaveResponses = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Save responses to the database
   * @param questionnaireType The type of questionnaire
   * @param responses Object containing question_id as keys and responses as values
   * @param questions Array of questions with their text content
   * @returns Promise resolving to success status
   */
  const saveResponses = async (
    questionnaireType: string | undefined,
    responses: Record<string, string>,
    questions: { id: string; question: string }[]
  ): Promise<boolean> => {
    if (!questionnaireType) return false;
    
    setSaving(true);
    setError(null);
    
    try {
      const responseTable = getResponseTable(questionnaireType);
      
      // Get authenticated user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error("No authenticated user to save responses");
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer vos réponses.",
          variant: "destructive"
        });
        return false;
      }
      
      // Delete existing responses for this user
      let deleteQuery = supabase
        .from(responseTable as any)
        .delete()
        .eq('user_id', user.id);
        
      // Add questionnaire_type filter only for the table that has this column
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
      console.log("Responses to save:", responsesToSave);
      
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
      
      toast({
        title: "Réponses enregistrées",
        description: "Vos réponses ont été sauvegardées avec succès."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error saving responses:', error);
      setError('Erreur lors de la sauvegarde des réponses.');
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de vos réponses.",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };
  
  return {
    saveResponses,
    saving,
    error
  };
};
