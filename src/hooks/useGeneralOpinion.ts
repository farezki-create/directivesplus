
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

export function useGeneralOpinion(open: boolean) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

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
          .order('display_order', { ascending: true });
        
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
        
        console.log('[GeneralOpinion] Questions loaded:', data?.length, 'questions');
        console.log('[GeneralOpinion] Questions order:', data?.map(q => q.display_order));
        setQuestions(data || []);
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

    if (open) {
      fetchQuestions();
      // Reset answers when dialog reopens
      setAnswers({});
    }
  }, [open, toast, currentLanguage]);

  const handleAnswerChange = (questionId: string, value: string, checked?: boolean) => {
    console.log('[GeneralOpinion] Answer change:', { questionId, value, checked });
    
    setAnswers(prev => {
      // Create a copy of the current answers for this question or initialize an empty array
      const currentAnswers = [...(prev[questionId] || [])];
      
      if (checked) {
        // Add the value if it's not already in the array
        if (!currentAnswers.includes(value)) {
          currentAnswers.push(value);
        }
      } else {
        // Remove the value if unchecked
        const index = currentAnswers.indexOf(value);
        if (index !== -1) {
          currentAnswers.splice(index, 1);
        }
      }
      
      console.log(`[GeneralOpinion] Updated answers for question ${questionId}:`, currentAnswers);
      
      return {
        ...prev,
        [questionId]: currentAnswers
      };
    });
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
        if (values.length === 0) return [];
        
        const question = questions.find(q => q.id === questionId);
        
        return values.map(value => ({
          user_id: userId,
          question_id: questionId,
          question_text: question?.question,
          response: value,
          questionnaire_type: 'general_opinion'
        }));
      });

      console.log('[GeneralOpinion] Prepared responses for insertion:', responses);

      if (responses.length === 0) {
        toast({
          title: currentLanguage === 'en' ? "Warning" : "Attention",
          description: currentLanguage === 'en' 
            ? "Please answer at least one question before saving." 
            : "Veuillez répondre à au moins une question avant d'enregistrer.",
          variant: "destructive",
        });
        return false;
      }

      const { error } = await supabase
        .from('questionnaire_responses')
        .upsert(responses, {
          onConflict: 'user_id,question_id,questionnaire_type,response'
        });

      if (error) {
        console.error('[GeneralOpinion] Error saving responses:', error);
        toast({
          title: currentLanguage === 'en' ? "Error" : "Erreur",
          description: currentLanguage === 'en' 
            ? "Unable to save your answers. Please try again." 
            : "Impossible d'enregistrer vos réponses. Veuillez réessayer.",
          variant: "destructive",
        });
        return false;
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
