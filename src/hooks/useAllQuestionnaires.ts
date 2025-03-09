
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SupportedLanguage } from '@/i18n/translations';

// Define a standard question interface to normalize data from different tables
export interface StandardQuestion {
  id: string | number;
  questionText: string;
  displayOrder: number;
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
    return {
      id: q.id,
      questionText: q.question || q.question_text || '',
      displayOrder: q.display_order || q.question_order || 0,
      options: q.options || null
    };
  };

  const { data: generalQuestions, isLoading: isLoadingGeneral } = useQuery({
    queryKey: ['general-questions', language],
    queryFn: async () => {
      const tableName = language === 'en' ? 'questionnaire_general_en' : 'questionnaire_general_fr';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data?.map(normalizeQuestion) || [];
    },
  });

  const { data: lifeSupportQuestions, isLoading: isLoadingLifeSupport } = useQuery({
    queryKey: ['life-support-questions', language],
    queryFn: async () => {
      const tableName = language === 'en' ? 'questionnaire_life_support_en' : 'questionnaire_life_support_fr';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('question_order', { ascending: true });

      if (error) throw error;
      return data?.map(normalizeQuestion) || [];
    },
  });

  const { data: advancedIllnessQuestions, isLoading: isLoadingAdvancedIllness } = useQuery({
    queryKey: ['advanced-illness-questions', language],
    queryFn: async () => {
      const tableName = language === 'en' ? 'questionnaire_advanced_illness_en' : 'questionnaire_advanced_illness_fr';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('question_order', { ascending: true });

      if (error) throw error;
      return data?.map(normalizeQuestion) || [];
    },
  });

  const { data: preferencesQuestions, isLoading: isLoadingPreferences } = useQuery({
    queryKey: ['preferences-questions', language],
    queryFn: async () => {
      const tableName = language === 'en' ? 'questionnaire_preferences_en' : 'questionnaire_preferences_fr';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
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
