
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
      if (!questionnaireType) return;
      
      setLoading(true);
      setError(null);
      
      const tableName = getSectionTable(questionnaireType);
      if (!tableName) {
        setError(`Section "${questionnaireType}" non trouvée`);
        setLoading(false);
        return;
      }
      
      try {
        // Fetching questions
        const { data: questionsData, error: questionsError } = await supabase
          .from(tableName as any)
          .select('*')
          .order('display_order', { ascending: true });
        
        if (questionsError) throw questionsError;
        
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
              yes: q.option_yes,
              no: q.option_no,
              unsure: q.option_unsure
            }
          }));
        } else {
          // Handle standard questions
          const standardQuestions = questionsData as unknown as StandardQuestion[];
          formattedQuestions = standardQuestions.map(q => ({
            id: String(q.id), // Ensure id is string
            question: q.question,
            explanation: q.explanation,
            display_order: q.display_order
          }));
        }
        
        setQuestions(formattedQuestions);
        
      } catch (err) {
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
