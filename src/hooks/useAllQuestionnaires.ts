import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupportedLanguage } from '@/i18n/translations';

// Define a standard question interface to normalize data from different tables
export interface StandardQuestion {
  id: string | number;
  questionText: string;
  displayOrder: number;
  explanation?: string;
  options?: any;
}

export interface QuestionnaireData {
  general: StandardQuestion[];
  lifeSupport: StandardQuestion[];
  advancedIllness: StandardQuestion[];
  preferences: StandardQuestion[];
}

export const useAllQuestionnaires = (language: SupportedLanguage) => {
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireData>({
    general: [],
    lifeSupport: [],
    advancedIllness: [],
    preferences: [],
  });

  // Helper function to normalize question data
  const normalizeQuestion = (q: any): StandardQuestion => {
    // Make sure to explicitly include explanation in the normalized question object
    const normalizedQuestion = {
      id: q.id,
      questionText: q.question || q.question_text || '',
      displayOrder: q.display_order || q.question_order || 0,
      explanation: q.explanation || '',
      options: q.options || null
    };

    console.log(`Normalizing question ID ${q.id}: Explanation present: ${!!q.explanation}, length: ${q.explanation?.length || 0}`);
    
    return normalizedQuestion;
  };

  const { data: generalQuestions, isLoading: isLoadingGeneral } = useQuery({
    queryKey: ['general-questions', language],
    queryFn: async () => {
      const tableName = language === 'en' ? 'questionnaire_general_en' : 'questionnaire_general_fr';
      
      console.log(`Fetching general questions from table ${tableName} with full data including explanations`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error(`Error fetching general questions: ${error.message}`);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} general questions`);
      if (data && data.length > 0) {
        console.log('Sample first question:', data[0]);
        console.log('Explanations present:', data.filter(q => !!q.explanation).length);
        console.log('Questions with explanations:', 
          data.filter(q => !!q.explanation).map(q => ({id: q.id, explanation: q.explanation?.substring(0, 30)})));
      }
      
      return data?.map(normalizeQuestion) || [];
    },
  });

  const { data: lifeSupportQuestions, isLoading: isLoadingLifeSupport } = useQuery({
    queryKey: ['life-support-questions', language],
    queryFn: async () => {
      const tableName = language === 'en' ? 'questionnaire_life_support_en' : 'questionnaire_life_support_fr';
      
      console.log(`Fetching life support questions from table ${tableName} with full data including explanations`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order(language === 'en' ? 'display_order' : 'question_order', { ascending: true });

      if (error) {
        console.error(`Error fetching life support questions: ${error.message}`);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} life support questions`);
      if (data && data.length > 0) {
        console.log('Sample first question:', data[0]);
        console.log('Explanations present:', data.filter(q => !!q.explanation).length);
        console.log('Questions with explanations:', 
          data.filter(q => !!q.explanation).map(q => ({id: q.id, explanation: q.explanation?.substring(0, 30)})));
      }
      
      return data?.map(normalizeQuestion) || [];
    },
  });

  const { data: advancedIllnessQuestions, isLoading: isLoadingAdvancedIllness } = useQuery({
    queryKey: ['advanced-illness-questions', language],
    queryFn: async () => {
      const tableName = language === 'en' ? 'questionnaire_advanced_illness_en' : 'questionnaire_advanced_illness_fr';
      
      console.log(`Fetching advanced illness questions from table ${tableName} with full data including explanations`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('question_order', { ascending: true });

      if (error) {
        console.error(`Error fetching advanced illness questions: ${error.message}`);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} advanced illness questions`);
      if (data && data.length > 0) {
        console.log('Sample first question:', data[0]);
        console.log('Explanations present:', data.filter(q => !!q.explanation).length);
        console.log('Questions with explanations:', 
          data.filter(q => !!q.explanation).map(q => ({id: q.id, explanation: q.explanation?.substring(0, 30)})));
      }
      
      return data?.map(normalizeQuestion) || [];
    },
  });

  const { data: preferencesQuestions, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['preferences-questions', language],
    queryFn: async () => {
      const tableName = language === 'en' ? 'questionnaire_preferences_en' : 'questionnaire_preferences_fr';
      
      console.log(`Fetching preferences questions from table ${tableName} with full data including explanations`);
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error(`Error fetching preferences questions: ${error.message}`);
        throw error;
      }
      
      console.log(`Fetched ${data?.length || 0} preferences questions`);
      if (data && data.length > 0) {
        console.log('Sample first question:', data[0]);
        console.log('Explanations present:', data.filter(q => !!q.explanation).length);
        console.log('Questions with explanations:', 
          data.filter(q => !!q.explanation).map(q => ({id: q.id, explanation: q.explanation?.substring(0, 30)})));
      }
      
      return data?.map(normalizeQuestion) || [];
    },
  });

  useEffect(() => {
    if (generalQuestions) {
      setQuestionnaires(prev => ({ ...prev, general: generalQuestions }));
    }
    if (lifeSupportQuestions) {
      setQuestionnaires(prev => ({ ...prev, lifeSupport: lifeSupportQuestions }));
    }
    if (advancedIllnessQuestions) {
      setQuestionnaires(prev => ({ ...prev, advancedIllness: advancedIllnessQuestions }));
    }
    if (preferencesQuestions) {
      setQuestionnaires(prev => ({ ...prev, preferences: preferencesQuestions }));
    }
  }, [generalQuestions, lifeSupportQuestions, advancedIllnessQuestions, preferencesQuestions]);

  const isLoading = isLoadingGeneral || isLoadingLifeSupport || isLoadingAdvancedIllness || isLoadingPreferences;

  return { questionnaires, isLoading };
};
