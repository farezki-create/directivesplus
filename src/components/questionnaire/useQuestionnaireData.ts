
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getSectionTable, getResponseTable } from "./utils";
import { Question, QuestionResponse, Responses, StandardQuestion, LifeSupportQuestion } from "./types";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

// Liste des tables de questionnaires autorisées pour le typage
type QuestionnaireTable = 
  | "questionnaire_general_fr" 
  | "questionnaire_life_support_fr"
  | "questionnaire_advanced_illness_fr" 
  | "questionnaire_preferences_fr";

// Liste des tables de réponses autorisées pour le typage
type ResponseTable = 
  | "questionnaire_responses"
  | "questionnaire_preferences_responses";

export const useQuestionnaireData = (pageId: string | undefined) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<Responses>({});
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

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
        // Debug logs
        console.log(`Fetching questions from table: ${tableName}`);
        
        // Vérification que la table est valide pour le typage
        if (!isValidQuestionnaireTable(tableName)) {
          throw new Error(`Table "${tableName}" non reconnue dans le système`);
        }
        
        // Fetching questions avec type casting pour satisfaire TypeScript
        const { data: questionsData, error: questionsError } = await supabase
          .from(tableName as QuestionnaireTable)
          .select('*')
          .order('display_order', { ascending: true });
        
        if (questionsError) {
          console.error('Error fetching questions:', questionsError);
          throw questionsError;
        }

        console.log('Questions data fetched:', questionsData);
        
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
        
        console.log('Formatted questions:', formattedQuestions);
        setQuestions(formattedQuestions);
        
        if (user) {
          // Fetch existing responses
          const responseTable = getResponseTable(pageId);
          console.log(`Fetching responses from table: ${responseTable}`);
          
          if (!isValidResponseTable(responseTable)) {
            throw new Error(`Table de réponses "${responseTable}" non reconnue dans le système`);
          }
          
          const { data: responsesData, error: responsesError } = await supabase
            .from(responseTable as ResponseTable)
            .select('question_id, response')
            .eq('questionnaire_type', pageId)
            .eq('user_id', user.id);
          
          if (responsesError) {
            console.error('Error fetching responses:', responsesError);
            throw responsesError;
          }
          
          console.log('Responses data fetched:', responsesData);
          
          // Convert responses array to object
          const responsesObj: Responses = {};
          if (responsesData) {
            // Type assertion to handle the conversion safely
            const responsesList = responsesData as unknown as QuestionResponse[];
            responsesList.forEach((r: QuestionResponse) => {
              responsesObj[r.question_id] = r.response;
            });
          }
          
          console.log('Responses object created:', responsesObj);
          setResponses(responsesObj);
        }
      } catch (err) {
        console.error('Error fetching questionnaire data:', err);
        setError('Erreur lors du chargement des questions. Veuillez réessayer.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
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
    console.log('Saving responses for pageId:', pageId);
    
    try {
      const responseTable = getResponseTable(pageId);
      
      if (!isValidResponseTable(responseTable)) {
        throw new Error(`Table de réponses "${responseTable}" non reconnue dans le système`);
      }
      
      // Define a properly typed array for our responses to save
      const responsesToSave: {
        question_id: string;
        response: string;
        questionnaire_type: string;
        user_id: string;
        question_text: string;
      }[] = Object.entries(responses).map(([questionId, response]) => ({
        question_id: questionId,
        response,
        questionnaire_type: pageId,
        user_id: user.id,
        question_text: questions.find(q => q.id === questionId)?.question || ''
      }));
      
      console.log('Responses to save:', responsesToSave);
      
      // Delete existing responses
      const { error: deleteError } = await supabase
        .from(responseTable as ResponseTable)
        .delete()
        .eq('questionnaire_type', pageId)
        .eq('user_id', user.id);
      
      if (deleteError) {
        console.error('Error deleting existing responses:', deleteError);
        throw deleteError;
      }
      
      // Only insert if there are responses to save
      if (responsesToSave.length > 0) {
        const { error: insertError } = await supabase
          .from(responseTable as ResponseTable)
          .insert(responsesToSave);
        
        if (insertError) {
          console.error('Error inserting responses:', insertError);
          throw insertError;
        }
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

  // Fonction helper pour vérifier si une table de questionnaire est valide
  function isValidQuestionnaireTable(tableName: string): tableName is QuestionnaireTable {
    return [
      'questionnaire_general_fr',
      'questionnaire_life_support_fr',
      'questionnaire_advanced_illness_fr',
      'questionnaire_preferences_fr'
    ].includes(tableName);
  }

  // Fonction helper pour vérifier si une table de réponses est valide
  function isValidResponseTable(tableName: string): tableName is ResponseTable {
    return [
      'questionnaire_responses',
      'questionnaire_preferences_responses'
    ].includes(tableName);
  }

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
