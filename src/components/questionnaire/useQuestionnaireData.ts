
import { useState, useEffect } from "react";
import { Question, Responses } from "./types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchQuestions, fetchResponses, getSectionTable } from "./dataFetchers";
import { saveResponses } from "./dataSavers";

export const useQuestionnaireData = (pageId: string) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<Responses>({});
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadQuestionnaireData = async () => {
      if (!pageId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Get the appropriate table name for this section
        const tableName = getSectionTable(pageId);
        
        // Fetch questions
        const formattedQuestions = await fetchQuestions(tableName);
        setQuestions(formattedQuestions);
        
        // Fetch responses if user is logged in
        if (user) {
          const responsesObj = await fetchResponses(pageId, user.id);
          setResponses(responsesObj);
        }
      } catch (err) {
        console.error('Error fetching questionnaire data:', err);
        setError('Erreur lors du chargement des questions. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    loadQuestionnaireData();
  }, [pageId, user]);

  const handleResponseChange = (questionId: string, value: string) => {
    console.log('Response changed:', questionId, value);
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleSave = async () => {
    if (!pageId || !user) {
      console.error('Cannot save: missing pageId or user');
      return;
    }
    
    setSaving(true);
    
    try {
      await saveResponses(pageId, user.id, responses, questions);
    } catch (err) {
      console.error('Error saving responses:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de vos réponses.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

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
