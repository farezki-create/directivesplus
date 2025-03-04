
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface PreferencesQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreferencesQuestionsDialog({
  open,
  onOpenChange,
}: PreferencesQuestionsDialogProps) {
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();

  // Reset answers when language changes to avoid mixed language responses
  useEffect(() => {
    setAnswers({});
  }, [currentLanguage]);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["preferences-questions", currentLanguage, open],
    queryFn: async () => {
      if (!open) return [];
      
      console.log(`[Preferences] Fetching questions in ${currentLanguage}...`);
      
      // Déterminer la table à interroger en fonction de la langue
      const tableName = currentLanguage === 'en' 
        ? 'preferences_questions_en' 
        : 'preferences_questions';
      
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("[Preferences] Error fetching questions:", error);
        throw error;
      }
      console.log('[Preferences] Questions loaded:', data?.length, 'questions');
      return data || [];
    },
    enabled: open, // Only fetch when dialog is open
  });

  const handleSubmit = async () => {
    try {
      console.log('[Preferences] Submitting answers:', answers);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error('[Preferences] No user ID found');
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer vos réponses.",
          variant: "destructive",
        });
        return;
      }

      // Prepare all responses for insertion
      const responses = Object.entries(answers).flatMap(([questionId, values]) => {
        const question = questions?.find(q => q.id === questionId);
        return values.map(value => ({
          user_id: userId,
          question_id: questionId,
          question_text: question?.question,
          response: value
        }));
      });

      console.log('[Preferences] Prepared responses for insertion:', responses);

      const { error } = await supabase
        .from('questionnaire_preferences_responses')
        .upsert(responses, {
          onConflict: 'user_id,question_id'
        });

      if (error) {
        console.error('[Preferences] Error saving responses:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer vos réponses. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      console.log('[Preferences] Responses saved successfully');
      toast({
        title: "Succès",
        description: "Vos réponses ont été enregistrées.",
      });
      onOpenChange(false);
      setAnswers({});
    } catch (error) {
      console.error('[Preferences] Unexpected error during submission:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log('[Preferences] Answer change:', { questionId, value });
    setAnswers(prev => ({
      ...prev,
      [questionId]: [value]
    }));
  };

  // Options de réponse selon la langue
  const getAnswerOptions = () => {
    if (currentLanguage === 'en') {
      return [
        { label: 'Yes', value: "yes" },
        { label: 'No', value: "no" },
        { label: 'I don\'t know', value: "undecided" }
      ];
    } else {
      return [
        { label: t('yes'), value: "oui" },
        { label: t('no'), value: "non" },
        { label: t('iDontKnow'), value: "indecis" }
      ];
    }
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('preferences')}
      onSubmit={handleSubmit}
      loading={isLoading}
      questionsLength={questions?.length || 0}
    >
      {questions?.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          options={getAnswerOptions()}
        />
      ))}
    </QuestionsDialogLayout>
  );
}
