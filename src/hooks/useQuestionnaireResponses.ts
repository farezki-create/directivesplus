
import { useState } from 'react';
import { useFetchResponses } from './questionnaire/useFetchResponses';
import { useSaveResponses } from './questionnaire/useSaveResponses';
import { QuestionnaireResponse } from './questionnaire/types';

/**
 * Main hook to manage questionnaire responses
 * @param questionnaireType The type of questionnaire
 * @returns Object containing responses and related functions
 */
export const useQuestionnaireResponses = (questionnaireType: string | undefined) => {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const { fetchResponses, loading: fetchLoading, error: fetchError } = useFetchResponses();
  const { saveResponses, saving: saveLoading, error: saveError } = useSaveResponses();
  
  const fetchResponsesForQuestionnaire = async () => {
    const loadedResponses = await fetchResponses(questionnaireType);
    setResponses(loadedResponses);
    return loadedResponses;
  };
  
  const saveResponsesForQuestionnaire = async (
    responses: Record<string, string>,
    questions: { id: string; question: string }[]
  ) => {
    return await saveResponses(questionnaireType, responses, questions);
  };

  return {
    responses,
    loading: fetchLoading || saveLoading,
    error: fetchError || saveError,
    fetchResponses: fetchResponsesForQuestionnaire,
    saveResponses: saveResponsesForQuestionnaire,
    setResponses
  };
};

// For backward compatibility
export type { QuestionnaireResponse };
