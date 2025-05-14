
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSectionTable, getResponseTable } from "./utils";
import { Question, QuestionResponse, Responses, StandardQuestion, LifeSupportQuestion, ResponseToSave } from "./types";
import { toast } from "@/hooks/use-toast";

export const useQuestionnaireData = (pageId: string | undefined) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<Responses>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!pageId) return;
      
      setLoading(true);
      setError(null);
      
      const tableName = getSectionTable(pageId);
      if (!tableName) {
        setError(`Section "${pageId}" non trouvée`);
        setLoading(false);
        return;
      }
      
      try {
        // Fetching questions
        const { data: questionsData, error: questionsError } = await supabase
          .from(tableName as any)
          .select('*')
          .order('display_order', { ascending: true });
        
        if (questionsError) throw questionsError;
        
        // Format questions based on table structure
        let formattedQuestions: Question[] = [];
        
        if (tableName === 'questionnaire_life_support_fr') {
          // Handle life support questions which have a different structure
          const lifeSupportQuestions = questionsData as unknown as LifeSupportQuestion[];
          formattedQuestions = lifeSupportQuestions.map(q => ({
            id: String(q.id), // Ensure id is string
            question: q.question_text,
            explanation: q.explanation,
            display_order: q.question_order,
            options: {
              yes: q.option_yes,
              no: q.option_no,
              unsure: q.option_unsure
            }
          }));
        } else {
          // Handle standard questions
          const standardQuestions = questionsData as unknown as StandardQuestion[];
          formattedQuestions = standardQuestions.map(q => ({
            id: String(q.id), // Ensure id is string
            question: q.question,
            explanation: q.explanation,
            display_order: q.display_order
          }));
        }
        
        setQuestions(formattedQuestions);
        
        // Fetch existing responses
        const responseTable = getResponseTable(pageId);
        const { data: responsesData, error: responsesError } = await supabase
          .from(responseTable as any)
          .select('question_id, response')
          .eq('questionnaire_type', pageId);
        
        if (responsesError) throw responsesError;
        
        // Convert responses array to object
        const responsesObj: Responses = {};
        if (responsesData) {
          // Type assertion to handle the conversion safely
          const responsesList = responsesData as unknown as QuestionResponse[];
          responsesList.forEach((r: QuestionResponse) => {
            responsesObj[r.question_id] = r.response;
          });
        }
        
        setResponses(responsesObj);
        
      } catch (err) {
        console.error('Error fetching questionnaire data:', err);
        setError('Erreur lors du chargement des questions. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
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
      const responseTable = getResponseTable(pageId);
      
      // Define a properly typed array for our responses to save
      const responsesToSave: ResponseToSave[] = Object.entries(responses).map(([questionId, response]) => ({
        question_id: questionId,
        response,
        questionnaire_type: pageId,
        question_text: questions.find(q => q.id === questionId)?.question || ''
      }));
      
      // Delete existing responses
      const { error: deleteError } = await supabase
        .from(responseTable as any)
        .delete()
        .eq('questionnaire_type', pageId);
      
      if (deleteError) throw deleteError;
      
      // Insert new responses
      if (responsesToSave.length > 0) {
        const { error: insertError } = await supabase
          .from(responseTable as any)
          .insert(responsesToSave);
        
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Réponses enregistrées",
        description: "Vos réponses ont été sauvegardées avec succès."
      });
      
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
