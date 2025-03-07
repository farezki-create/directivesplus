
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/language/useLanguage";

interface QuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuestionsDialog({ open, onOpenChange }: QuestionsDialogProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    async function fetchQuestions() {
      if (!open) return; // Only fetch when dialog is open
      
      setLoading(true);
      try {
        console.log(`[GeneralOpinion] Loading general opinion questions from database in ${currentLanguage}...`);
        
        let data, error;
        
        if (currentLanguage === 'en') {
          // Fetch English questions
          const result = await supabase
            .from('questions_en')
            .select('*')
            .eq('category', 'general_opinion')
            .order('display_order', { ascending: true });
          
          data = result.data;
          error = result.error;
        } else {
          // Fetch French questions
          const result = await supabase
            .from('questions')
            .select('*')
            .eq('category', 'general_opinion')
            .order('display_order', { ascending: true });
          
          data = result.data;
          error = result.error;
        }
        
        if (error) {
          console.error('[GeneralOpinion] Error fetching questions:', error);
          toast({
            title: currentLanguage === 'fr' ? "Erreur" : "Error",
            description: currentLanguage === 'fr' 
              ? "Impossible de charger les questions. Veuillez réessayer." 
              : "Unable to load questions. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        console.log('[GeneralOpinion] Questions loaded:', data?.length, 'questions');
        setQuestions(data || []);
      } catch (error) {
        console.error('[GeneralOpinion] Unexpected error:', error);
        toast({
          title: currentLanguage === 'fr' ? "Erreur" : "Error",
          description: currentLanguage === 'fr'
            ? "Une erreur inattendue s'est produite."
            : "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [open, toast, currentLanguage]);

  const handleAnswerChange = (questionId: string, value: string, checked: boolean) => {
    console.log('[GeneralOpinion] Answer change:', { questionId, value, checked });
    
    setAnswers(prev => {
      // For checkbox behavior, we need to handle the checked state differently
      if (checked) {
        // If checked, add the value to the array if not already present
        return {
          ...prev,
          [questionId]: [value]
        };
      } else {
        // If unchecked, remove the value from the array
        return {
          ...prev,
          [questionId]: prev[questionId]?.filter(v => v !== value) || []
        };
      }
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
          title: currentLanguage === 'fr' ? "Erreur" : "Error",
          description: currentLanguage === 'fr'
            ? "Vous devez être connecté pour enregistrer vos réponses."
            : "You must be logged in to save your answers.",
          variant: "destructive",
        });
        return;
      }

      // Prepare all responses for insertion
      const responses = Object.entries(answers).flatMap(([questionId, values]) => {
        const question = questions.find(q => q.id === questionId);
        const questionText = currentLanguage === 'en' 
          ? question?.question 
          : question?.Question;
        
        return values.map(value => ({
          user_id: userId,
          question_id: questionId,
          question_text: questionText,
          response: value
        }));
      });

      console.log('[GeneralOpinion] Prepared responses for insertion:', responses);

      if (responses.length === 0) {
        toast({
          title: currentLanguage === 'fr' ? "Attention" : "Warning",
          description: currentLanguage === 'fr'
            ? "Veuillez sélectionner au moins une réponse."
            : "Please select at least one answer.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('questionnaire_general_responses')
        .upsert(responses, {
          onConflict: 'user_id,question_id'
        });

      if (error) {
        console.error('[GeneralOpinion] Error saving responses:', error);
        toast({
          title: currentLanguage === 'fr' ? "Erreur" : "Error",
          description: currentLanguage === 'fr'
            ? "Impossible d'enregistrer vos réponses. Veuillez réessayer."
            : "Unable to save your answers. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('[GeneralOpinion] Responses saved successfully');
      toast({
        title: currentLanguage === 'fr' ? "Succès" : "Success",
        description: currentLanguage === 'fr'
          ? "Vos réponses ont été enregistrées."
          : "Your answers have been saved.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('[GeneralOpinion] Unexpected error during submission:', error);
      toast({
        title: currentLanguage === 'fr' ? "Erreur" : "Error",
        description: currentLanguage === 'fr'
          ? "Une erreur inattendue s'est produite lors de l'enregistrement."
          : "An unexpected error occurred while saving.",
        variant: "destructive",
      });
    }
  };

  const getQuestionOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' }
      ];
    } else {
      return [
        { value: 'oui', label: 'OUI' },
        { value: 'non', label: 'NON' }
      ];
    }
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('generalOpinion')}
      description={t('generalOpinionDesc')}
      onSubmit={handleSubmit}
      loading={loading}
      questionsLength={questions.length}
    >
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value, checked) => handleAnswerChange(question.id, value, checked as boolean)}
          options={getQuestionOptions()}
        />
      ))}
    </QuestionsDialogLayout>
  );
}
