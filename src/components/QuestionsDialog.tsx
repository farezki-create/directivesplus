
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

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
    }
  }, [open, toast, currentLanguage]);

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
          questionnaire_type: 'general_opinion'
        }));
      });

      console.log('[GeneralOpinion] Prepared responses for insertion:', responses);

      const { error } = await supabase
        .from('questionnaire_responses')
        .upsert(responses, {
          onConflict: 'user_id,question_id,questionnaire_type'
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
        return;
      }

      console.log('[GeneralOpinion] Responses saved successfully');
      toast({
        title: currentLanguage === 'en' ? "Success" : "Succès",
        description: currentLanguage === 'en' 
          ? "Your answers have been saved." 
          : "Vos réponses ont été enregistrées.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('[GeneralOpinion] Unexpected error during submission:', error);
      toast({
        title: currentLanguage === 'en' ? "Error" : "Erreur",
        description: currentLanguage === 'en' 
          ? "An unexpected error occurred while saving." 
          : "Une erreur inattendue s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  const getQuestionOptions = (question: any) => {
    if (currentLanguage === 'en') {
      return [
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
        { value: 'i_dont_know', label: "I don't know" }
      ];
    } else {
      return [
        { value: 'oui', label: t('yes') },
        { value: 'non', label: t('no') },
        { value: 'je_ne_sais_pas', label: t('dontKnow') }
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
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          options={getQuestionOptions(question)}
        />
      ))}
    </QuestionsDialogLayout>
  );
}
