
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getSectionTable } from '@/components/questionnaire/utils';
import { Question, StandardQuestion, LifeSupportQuestion } from '@/components/questionnaire/types';
import { toast } from '@/hooks/use-toast';

/**
 * Hook to fetch questions for a specific questionnaire type
 * @param questionnaireType The type of questionnaire
 * @returns Object containing questions and loading state
 */
export const useQuestionsData = (questionnaireType: string | undefined) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!questionnaireType) {
        console.error('No questionnaire type provided');
        setError('Type de questionnaire non spécifié');
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      const tableName = getSectionTable(questionnaireType);
      if (!tableName) {
        console.error(`Section "${questionnaireType}" non trouvée`);
        setError(`Section "${questionnaireType}" non trouvée`);
        setLoading(false);
        return;
      }
      
      
      
      try {
        // Fetching questions with detailed error logging
        let query = supabase
          .from(tableName as any) // Type assertion needed for dynamic table name
          .select('*');
        
        // Add order clause only for tables that have display_order
        if (tableName !== 'questionnaire_life_support_fr') {
          query = query.order('display_order', { ascending: true });
        } else {
          // For life_support, use question_order instead
          query = query.order('question_order', { ascending: true });
        }
        
        const { data: questionsData, error: questionsError } = await query;
        
        if (questionsError) {
          console.error('Error fetching questions data:', questionsError);
          throw questionsError;
        }
        
        
        
        if (!questionsData || questionsData.length === 0) {
          console.warn(`No questions found in table: ${tableName}`);
          setQuestions([]);
          setLoading(false);
          return;
        }
        
        // Format questions based on table structure
        let formattedQuestions: Question[] = [];
        
        if (tableName === 'questionnaire_life_support_fr') {
          // Handle life support questions which have a different structure
          const lifeSupportQuestions = questionsData as unknown as LifeSupportQuestion[];
          formattedQuestions = lifeSupportQuestions.map(q => ({
            id: String(q.id), // Ensure id is string
            question: q.question_text,
            explanation: q.explanation,
            display_order: q.question_order,
            options: {
              yes: q.option_yes || 'Oui',
              no: q.option_no || 'Non',
              unsure: q.option_unsure || 'Je ne sais pas'
            }
          }));
        } else {
          // Handle standard questions for other questionnaires
          const standardQuestions = questionsData as unknown as StandardQuestion[];
          formattedQuestions = standardQuestions.map(q => ({
            id: String(q.id), // Ensure id is string
            question: q.question,
            explanation: q.explanation,
            display_order: q.display_order,
            options: {
              yes: 'Oui',
              no: 'Non',
              unsure: 'Je ne sais pas'
            }
          }));
        }
        
        
        setQuestions(formattedQuestions);
        
      } catch (err: any) {
        console.error('Error fetching questions data:', err);
        setError('Erreur lors du chargement des questions. Veuillez réessayer.');
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les questions du questionnaire.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, [questionnaireType]);
  
  return {
    questions,
    loading,
    error
  };
};
