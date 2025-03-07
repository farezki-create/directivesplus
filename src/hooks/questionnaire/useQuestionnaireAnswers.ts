
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { QuestionnaireQuestion, QuestionnaireType } from "./useQuestionnaireQuestions";
import { useLanguage } from "@/hooks/language/useLanguage";

export function useQuestionnaireAnswers(
  type: QuestionnaireType,
  questions: QuestionnaireQuestion[], 
  onSuccess: () => void,
  allowMultiple: boolean = false
) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { currentLanguage } = useLanguage();

  const handleAnswerChange = (questionId: string, value: string, checked: boolean) => {
    console.log(`[Questionnaire] ${type} answer change:`, { questionId, value, checked });
    
    if (checked) {
      if (allowMultiple) {
        // Add to existing answers for multiple selection
        setAnswers(prev => {
          const updatedValues = [...(prev[questionId] || [])];
          if (!updatedValues.includes(value)) {
            updatedValues.push(value);
          }
          return {
            ...prev,
            [questionId]: updatedValues
          };
        });
      } else {
        // Replace existing answer for single selection
        setAnswers(prev => ({
          ...prev,
          [questionId]: [value]
        }));
      }
    } else {
      // Remove from existing answers
      setAnswers(prev => {
        const newValues = prev[questionId]?.filter(v => v !== value) || [];
        return {
          ...prev,
          [questionId]: newValues
        };
      });
    }
  };

  const handleSubmit = async () => {
    try {
      console.log(`[Questionnaire] Submitting ${type} answers:`, answers);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error(`[Questionnaire] No user ID found`);
        toast({
          title: currentLanguage === 'en' ? "Error" : "Erreur",
          description: currentLanguage === 'en' 
            ? "You must be logged in to save your answers." 
            : "Vous devez être connecté pour enregistrer vos réponses.",
          variant: "destructive",
        });
        return;
      }

      // Prepare all responses for insertion
      const responses = Object.entries(answers).flatMap(([questionId, values]) => {
        const question = questions.find(q => q.id === questionId);
        return values.map(value => ({
          user_id: userId,
          question_id: questionId,
          question_text: question?.question,
          response: value,
          questionnaire_type: type
        }));
      });

      console.log(`[Questionnaire] Prepared ${type} responses for insertion:`, responses);

      // First, delete existing responses for this user and questionnaire type
      const { error: deleteError } = await supabase
        .from('questionnaire_responses')
        .delete()
        .eq('user_id', userId)
        .eq('questionnaire_type', type);

      if (deleteError) {
        console.error(`[Questionnaire] Error deleting existing ${type} responses:`, deleteError);
        throw deleteError;
      }

      // Insert new responses
      if (responses.length > 0) {
        const { error } = await supabase
          .from('questionnaire_responses')
          .insert(responses);

        if (error) {
          console.error(`[Questionnaire] Error saving ${type} responses:`, error);
          throw error;
        }
      }

      console.log(`[Questionnaire] ${type} responses saved successfully`);
      toast({
        title: currentLanguage === 'en' ? "Success" : "Succès",
        description: currentLanguage === 'en' 
          ? "Your answers have been saved." 
          : "Vos réponses ont été enregistrées.",
      });
      onSuccess();
    } catch (error) {
      console.error(`[Questionnaire] Unexpected error during ${type} submission:`, error);
      toast({
        title: currentLanguage === 'en' ? "Error" : "Erreur",
        description: currentLanguage === 'en' 
          ? "An unexpected error occurred during saving." 
          : "Une erreur inattendue s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  return { answers, handleAnswerChange, handleSubmit };
}
