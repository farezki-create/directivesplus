
import { useState, useEffect, useCallback, useRef } from "react";
import { useQuestionsData } from "@/hooks/useQuestionsData";
import { useQuestionnaireResponses } from "@/hooks/useQuestionnaireResponses";

export const useQuestionnaireData = (pageId: string | undefined) => {
  const safePageId = pageId || '';
  const [saving, setSaving] = useState(false);
  const initialFetchDone = useRef(false);
  const isMounted = useRef(true);
  
  const { questions, loading: questionsLoading, error: questionsError } = useQuestionsData(safePageId);
  const { responses, loading: responsesLoading, error: responsesError, fetchResponses, saveResponses, setResponses } = useQuestionnaireResponses(safePageId);
  
  const handleResponseChange = useCallback((questionId: string, value: string) => {
    if (!isMounted.current) return;
    setResponses(prevResponses => ({ ...prevResponses, [questionId]: value }));
  }, [setResponses]);
  
  useEffect(() => {
    isMounted.current = true;
    const fetchInitialResponses = async () => {
      if (!safePageId || initialFetchDone.current) return;
      try {
        initialFetchDone.current = true;
        await fetchResponses();
      } catch (error) {
        console.error("Error fetching initial responses:", error);
      }
    };
    fetchInitialResponses();
    return () => { isMounted.current = false; };
  }, [safePageId, fetchResponses]);
  
  const handleSave = useCallback(async () => {
    if (!safePageId || !questions || !isMounted.current) return;
    setSaving(true);
    try {
      await saveResponses(responses, questions);
    } catch (error) {
      console.error("Error saving responses:", error);
    } finally {
      if (isMounted.current) setSaving(false);
    }
  }, [safePageId, responses, questions, saveResponses]);
  
  return { questions, loading: questionsLoading || responsesLoading, error: questionsError || responsesError, responses, saving, handleResponseChange, handleSave };
};
