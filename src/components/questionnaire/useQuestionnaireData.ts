
import { useState, useEffect, useCallback, useRef } from "react";
import { useQuestionsData } from "@/hooks/useQuestionsData";
import { useQuestionnaireResponses } from "@/hooks/useQuestionnaireResponses";

export const useQuestionnaireData = (pageId: string | undefined) => {
  // Provide default value to ensure consistency
  const safePageId = pageId || '';
  const [saving, setSaving] = useState(false);
  const initialFetchDone = useRef(false);
  const isMounted = useRef(true);
  
  // Always call hooks unconditionally at the top level
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
    if (!isMounted.current) return;
    
    console.log(`useQuestionnaireData: Changing response for question ${questionId} to "${value}"`);
    setResponses(prevResponses => {
      const newResponses = { ...prevResponses, [questionId]: value };
      console.log("New responses state:", newResponses);
      return newResponses;
    });
  }, [setResponses]);
  
  // Handle one-time fetching of responses
  useEffect(() => {
    isMounted.current = true;
    
    const fetchInitialResponses = async () => {
      if (!safePageId || initialFetchDone.current) return;
      
      try {
        console.log("Initial fetch of responses for pageId:", safePageId);
        initialFetchDone.current = true;
        await fetchResponses();
      } catch (error) {
        console.error("Error fetching initial responses:", error);
      }
    };
    
    fetchInitialResponses();
    
    return () => {
      console.log("Cleaning up useQuestionnaireData for pageId:", safePageId);
      isMounted.current = false;
    };
  }, [safePageId, fetchResponses]);
  
  // Stabilize handleSave function with useCallback and proper dependencies
  const handleSave = useCallback(async () => {
    if (!safePageId || !questions || !isMounted.current) return;
    
    setSaving(true);
    console.log("Saving responses:", responses);
    
    try {
      await saveResponses(responses, questions);
    } catch (error) {
      console.error("Error saving responses:", error);
    } finally {
      if (isMounted.current) {
        setSaving(false);
      }
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
