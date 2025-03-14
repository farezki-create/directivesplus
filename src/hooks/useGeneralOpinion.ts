
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

// Define a type for our question objects
type QuestionObject = {
  id: string;
  question?: string;
  question_text?: string;
  display_order?: number;
  question_order?: number;
  created_at?: string;
};

export function useGeneralOpinion(dialogOpen: boolean) {
  const [questions, setQuestions] = useState<QuestionObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  // Fetch questions when the dialog opens
  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log(`[GeneralOpinion] Fetching questions in ${currentLanguage}...`);
        
        const tableName = currentLanguage === 'en' 
          ? 'questionnaire_general_en' 
          : 'questionnaire_general_fr';
        
        console.log(`[GeneralOpinion] Using table: ${tableName}`);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order(currentLanguage === 'en' ? 'display_order' : 'question_order', { ascending: true });
        
        if (error) {
          console.error('[GeneralOpinion] Error fetching questions:', error);
          toast({
            title: currentLanguage === 'en' ? "Error" : "Erreur",
            description: currentLanguage === 'en' 
              ? "Unable to load questions. Please try again." 
              : "Impossible de charger les questions. Veuillez réessayer.",
            variant: "destructive",
          });
          return;
        }
        
        // Ensure the questions are sorted by their display order
        const sortedData = data?.sort((a: QuestionObject, b: QuestionObject) => {
          // First try to sort by question_order (for French)
          if (a.question_order !== undefined && b.question_order !== undefined) {
            return a.question_order - b.question_order;
          }
          // Then try to sort by display_order (for English)
          if (a.display_order !== undefined && b.display_order !== undefined) {
            return a.display_order - b.display_order;
          }
          return 0;
        });
        
        console.log('[GeneralOpinion] Questions loaded:', sortedData?.length, 'questions');
        console.log('[GeneralOpinion] Questions data:', sortedData);
        setQuestions(sortedData || []);
      } catch (error) {
        console.error('[GeneralOpinion] Unexpected error:', error);
        toast({
          title: currentLanguage === 'en' ? "Error" : "Erreur",
          description: currentLanguage === 'en' 
            ? "An unexpected error occurred." 
            : "Une erreur inattendue s'est produite.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (dialogOpen) {
      fetchQuestions();
      setLoading(true);
    }
  }, [dialogOpen, toast, currentLanguage]);

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log('[GeneralOpinion] Answer change:', { questionId, value });
    setAnswers(prev => ({
      ...prev,
      [questionId]: [value]
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log('[GeneralOpinion] Submitting answers:', answers);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error('[GeneralOpinion] No user ID found');
        toast({
          title: currentLanguage === 'en' ? "Error" : "Erreur",
          description: currentLanguage === 'en' 
            ? "You must be logged in to save your answers." 
            : "Vous devez être connecté pour enregistrer vos réponses.",
          variant: "destructive",
        });
        return false;
      }

      // Prepare all responses for insertion
      const responses = Object.entries(answers).flatMap(([questionId, values]) => {
        // Find the full question object to get correct ID format
        const question = questions.find(q => q.id.toString() === questionId);
        
        if (!question) {
          console.error(`[GeneralOpinion] Question with ID ${questionId} not found`);
          return [];
        }
        
        return values.map(value => ({
          user_id: userId,
          question_id: question.id, // Use the actual UUID from the question object
          question_text: question.question,
          response: value,
          questionnaire_type: 'general_opinion'
        }));
      });

      console.log('[GeneralOpinion] Prepared responses for insertion:', responses);

      // Delete existing responses before inserting new ones
      await supabase
        .from('questionnaire_responses')
        .delete()
        .eq('user_id', userId)
        .eq('questionnaire_type', 'general_opinion');

      // Insert new responses
      for (const response of responses) {
        const { error } = await supabase
          .from('questionnaire_responses')
          .insert(response);

        if (error) {
          console.error('[GeneralOpinion] Error saving response:', error);
          toast({
            title: currentLanguage === 'en' ? "Error" : "Erreur",
            description: currentLanguage === 'en' 
              ? "Unable to save your answers. Please try again." 
              : "Impossible d'enregistrer vos réponses. Veuillez réessayer.",
            variant: "destructive",
          });
          return false;
        }
      }

      console.log('[GeneralOpinion] Responses saved successfully');
      toast({
        title: currentLanguage === 'en' ? "Success" : "Succès",
        description: currentLanguage === 'en' 
          ? "Your answers have been saved." 
          : "Vos réponses ont été enregistrées.",
      });
      return true;
    } catch (error) {
      console.error('[GeneralOpinion] Unexpected error during submission:', error);
      toast({
        title: currentLanguage === 'en' ? "Error" : "Erreur",
        description: currentLanguage === 'en' 
          ? "An unexpected error occurred while saving." 
          : "Une erreur inattendue s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    questions,
    loading,
    answers,
    handleAnswerChange,
    handleSubmit
  };
}
