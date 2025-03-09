
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage, type SupportedLanguage } from '@/hooks/useLanguage';

// Define types for the question structures from different tables
interface StandardQuestion {
  id: string | number;
  question?: string;
  question_text?: string;
  display_order?: number;
  question_order?: number;
  created_at?: string;
  option_yes?: string;
  option_no?: string;
  option_unsure?: string;
}

export interface NormalizedQuestion {
  id: string | number;
  question: string;
  displayOrder: number | null;
  type: 'general' | 'life_support' | 'advanced_illness' | 'preferences';
  options?: {
    yes: string;
    no: string;
    unsure: string;
  };
}

export const useAllQuestionnaires = () => {
  const { currentLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<'general' | 'life_support' | 'advanced_illness' | 'preferences'>('general');

  // Normalize a question to a standard format
  const normalizeQuestion = (question: StandardQuestion, type: NormalizedQuestion['type']): NormalizedQuestion => {
    return {
      id: question.id,
      question: question.question || question.question_text || '',
      displayOrder: question.display_order || question.question_order || null,
      type,
      ...(question.option_yes && question.option_no && question.option_unsure ? {
        options: {
          yes: question.option_yes,
          no: question.option_no,
          unsure: question.option_unsure
        }
      } : {})
    };
  };

  // Function to fetch questions from a specific questionnaire table
  const fetchQuestions = async (type: NormalizedQuestion['type'], lang: SupportedLanguage) => {
    console.log(`Fetching ${type} questions in ${lang}...`);
    
    // Determine which table to query based on language and type
    const tableName = `questionnaire_${type}_${lang}`;
    
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .order(type === 'life_support' && lang === 'fr' ? 'question_order' : 'display_order', { ascending: true });

    if (error) {
      console.error(`Error fetching ${type} questions:`, error);
      throw error;
    }
    
    console.log(`${type} questions loaded:`, data?.length, 'questions');
    
    // Normalize the data
    return (data || []).map(question => normalizeQuestion(question, type));
  };

  // Fetch general questions
  const { data: generalQuestions, isLoading: generalLoading } = useQuery({
    queryKey: ["general-questions", currentLanguage],
    queryFn: () => fetchQuestions('general', currentLanguage),
  });

  // Fetch life support questions
  const { data: lifeSupportQuestions, isLoading: lifeSupportLoading } = useQuery({
    queryKey: ["life-support-questions", currentLanguage],
    queryFn: () => fetchQuestions('life_support', currentLanguage),
  });

  // Fetch advanced illness questions
  const { data: advancedIllnessQuestions, isLoading: advancedIllnessLoading } = useQuery({
    queryKey: ["advanced-illness-questions", currentLanguage],
    queryFn: () => fetchQuestions('advanced_illness', currentLanguage),
  });

  // Fetch preferences questions
  const { data: preferencesQuestions, isLoading: preferencesLoading } = useQuery({
    queryKey: ["preferences-questions", currentLanguage],
    queryFn: () => fetchQuestions('preferences', currentLanguage),
  });

  // Get active questions based on the selected tab
  const getActiveQuestions = () => {
    switch (activeTab) {
      case 'general':
        return generalQuestions || [];
      case 'life_support':
        return lifeSupportQuestions || [];
      case 'advanced_illness':
        return advancedIllnessQuestions || [];
      case 'preferences':
        return preferencesQuestions || [];
      default:
        return [];
    }
  };

  // Loading state for active tab
  const isActiveTabLoading = () => {
    switch (activeTab) {
      case 'general':
        return generalLoading;
      case 'life_support':
        return lifeSupportLoading;
      case 'advanced_illness':
        return advancedIllnessLoading;
      case 'preferences':
        return preferencesLoading;
      default:
        return false;
    }
  };

  return {
    activeTab,
    setActiveTab,
    generalQuestions,
    lifeSupportQuestions,
    advancedIllnessQuestions,
    preferencesQuestions,
    getActiveQuestions,
    isLoading: isActiveTabLoading(),
    allQuestionsLoaded: 
      !generalLoading && 
      !lifeSupportLoading && 
      !advancedIllnessLoading && 
      !preferencesLoading
  };
};
