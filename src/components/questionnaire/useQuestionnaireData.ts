
import { useState, useEffect, useCallback, useRef } from "react";
import { useQuestionsData } from "@/hooks/useQuestionsData";
import { useQuestionnaireResponses } from "@/hooks/useQuestionnaireResponses";

export const useQuestionnaireData = (pageId: string | undefined) => {
  const [saving, setSaving] = useState(false);
  const fetchedRef = useRef(false);
  
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
    if (fetchedRef.current || !pageId) return;
    console.log("Fetching responses for pageId:", pageId);
    fetchedRef.current = true;
    return fetchResponses();
  }, [pageId, fetchResponses]);
  
  // Load initial responses only when pageId changes or component mounts
  useEffect(() => {
    if (pageId) {
      memoizedFetchResponses();
    }
    
    return () => {
      // Reset the flag when the component unmounts or pageId changes
      fetchedRef.current = false;
    };
  }, [pageId, memoizedFetchResponses]);
  
  const handleResponseChange = useCallback((questionId: string, value: string) => {
    console.log(`Setting response for ${questionId} to ${value}`);
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  }, [setResponses]);
  
  const handleSave = async () => {
    if (!pageId) return;
    
    setSaving(true);
    
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
