
import { useState, useEffect, useCallback, useRef } from "react";
import { useQuestionsData } from "@/hooks/useQuestionsData";
import { useQuestionnaireResponses } from "@/hooks/useQuestionnaireResponses";

export const useQuestionnaireData = (pageId: string | undefined) => {
  // Provide default value to ensure consistency
  const safePageId = pageId || '';
  const [saving, setSaving] = useState(false);
  const initialFetchDone = useRef(false);
  
  // Always call hooks with consistent parameters
  const { 
    questions,
    loading: questionsLoading, 
    error: questionsError 
  } = useQuestionsData(safePageId);
  
  const {
    responses,
    loading: responsesLoading,
    error: responsesError,
    fetchResponses,
    saveResponses,
    setResponses
  } = useQuestionnaireResponses(safePageId);
  
  // Stabilize handleResponseChange function with useCallback
  const handleResponseChange = useCallback((questionId: string, value: string) => {
    console.log(`useQuestionnaireData: Changing response for question ${questionId} to "${value}"`);
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: value
    }));
  }, [setResponses]);
  
  // Stabilize memoizedFetchResponses with useCallback
  const memoizedFetchResponses = useCallback(() => {
    if (!initialFetchDone.current && safePageId) {
      console.log("Fetching responses for pageId:", safePageId);
      initialFetchDone.current = true;
      return fetchResponses();
    }
    return Promise.resolve({});
  }, [safePageId, fetchResponses]);
  
  // Use useEffect with proper dependencies
  useEffect(() => {
    // Reset the ref when page changes
    initialFetchDone.current = false;
    
    if (safePageId) {
      memoizedFetchResponses();
    }
    
    // Cleanup function
    return () => {
      initialFetchDone.current = false;
    };
  }, [safePageId, memoizedFetchResponses]);
  
  // Stabilize handleSave function with useCallback and proper dependencies
  const handleSave = useCallback(async () => {
    if (!safePageId || !questions) return;
    
    setSaving(true);
    console.log("Saving responses:", responses);
    
    try {
      await saveResponses(responses, questions);
    } finally {
      setSaving(false);
    }
  }, [safePageId, responses, questions, saveResponses]);
  
  // Derive loading and error from the specialized hooks
  const loading = questionsLoading || responsesLoading;
  const error = questionsError || responsesError;

  return {
    questions,
    loading,
    error,
    responses,
    saving,
    handleResponseChange,
    handleSave
  };
};
