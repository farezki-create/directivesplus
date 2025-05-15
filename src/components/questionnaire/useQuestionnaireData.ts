
import { useState, useEffect } from "react";
import { useQuestionsData } from "@/hooks/useQuestionsData";
import { useQuestionnaireResponses } from "@/hooks/useQuestionnaireResponses";
import { Question } from "./types";

export const useQuestionnaireData = (pageId: string | undefined) => {
  const [saving, setSaving] = useState(false);
  
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
  
  // Load initial responses
  useEffect(() => {
    if (pageId) {
      fetchResponses();
    }
  }, [pageId]);
  
  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
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
