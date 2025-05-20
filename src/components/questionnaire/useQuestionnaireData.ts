
import { useState, useEffect, useCallback, useRef } from "react";
import { useQuestionsData } from "@/hooks/useQuestionsData";
import { useQuestionnaireResponses } from "@/hooks/useQuestionnaireResponses";

export const useQuestionnaireData = (pageId: string | undefined) => {
  const [saving, setSaving] = useState(false);
  const initialFetchDone = useRef(false);
  
  // Use our specialized hooks
  const { 
    questions,
    loading: questionsLoading, 
    error: questionsError 
  } = useQuestionsData(pageId);
  
  const {
    responses,
    loading: responsesLoading,
    error: responsesError,
    fetchResponses,
    saveResponses,
    setResponses
  } = useQuestionnaireResponses(pageId);
  
  // Memoize fetchResponses to prevent infinite loops
  const memoizedFetchResponses = useCallback(() => {
    if (!initialFetchDone.current && pageId) {
      console.log("Fetching responses for pageId:", pageId);
      initialFetchDone.current = true;
      return fetchResponses();
    }
    return Promise.resolve();
  }, [pageId, fetchResponses]);
  
  // Load initial responses only when pageId changes or component mounts
  useEffect(() => {
    if (pageId) {
      initialFetchDone.current = false;
      memoizedFetchResponses();
    }
    
    return () => {
      // Reset the ref when the component unmounts or pageId changes
      initialFetchDone.current = false;
    };
  }, [pageId, memoizedFetchResponses]);
  
  const handleResponseChange = (questionId: string, value: string) => {
    console.log(`useQuestionnaireData: Changing response for question ${questionId} to "${value}"`);
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleSave = async () => {
    if (!pageId) return;
    
    setSaving(true);
    console.log("Saving responses:", responses);
    
    try {
      await saveResponses(responses, questions);
    } finally {
      setSaving(false);
    }
  };
  
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
