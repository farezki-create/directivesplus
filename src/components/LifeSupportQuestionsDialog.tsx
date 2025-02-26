
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface LifeSupportQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LifeSupportQuestionsDialog({ 
  open, 
  onOpenChange 
}: LifeSupportQuestionsDialogProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log(`[LifeSupport] Fetching questions in ${currentLanguage}...`);
        
        // Déterminer la table à interroger en fonction de la langue
        const tableName = currentLanguage === 'en' 
          ? 'life_support_questions_en' 
          : 'life_support_questions';
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('display_order', { ascending: true });
        
        if (error) {
          console.error('[LifeSupport] Error fetching questions:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les questions. Veuillez réessayer.",
            variant: "destructive",
          });
          return;
        }
        
        console.log('[LifeSupport] Questions loaded:', data?.length, 'questions');
        setQuestions(data || []);
      } catch (error) {
        console.error('[LifeSupport] Unexpected error:', error);
        toast({
          title: "Erreur",
          description: "Une erreur inattendue s'est produite.",
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

  const handleAnswerChange = (questionId: string, value: string, checked: boolean) => {
    console.log('[LifeSupport] Answer change:', { questionId, value, checked });
    
    if (checked) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: [value]
      }));
    } else {
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
      console.log('[LifeSupport] Submitting answers:', answers);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error('[LifeSupport] No user ID found');
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer vos réponses.",
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
          response: value
        }));
      });

      console.log('[LifeSupport] Prepared responses for insertion:', responses);

      const { error } = await supabase
        .from('questionnaire_life_support_responses')
        .upsert(responses, {
          onConflict: 'user_id,question_id'
        });

      if (error) {
        console.error('[LifeSupport] Error saving responses:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer vos réponses. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      console.log('[LifeSupport] Responses saved successfully');
      toast({
        title: "Succès",
        description: "Vos réponses ont été enregistrées.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('[LifeSupport] Unexpected error during submission:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  // Options de réponse selon la langue
  const getQuestionOptions = (question: any) => {
    if (currentLanguage === 'en') {
      return [
        { value: 'Yes', label: 'Yes' },
        { value: 'Yes for a moderate period', label: 'Yes for a moderate period' },
        { value: 'Yes only if the medical team deems it useful', label: 'Yes only if the medical team deems it useful' },
        { value: 'No quickly abandon therapeutic', label: 'No, quickly abandon therapeutic' },
        { value: 'Non-suffering is to be prioritized', label: 'Non-suffering is to be prioritized' },
        { value: 'Undecided', label: 'Undecided' }
      ];
    } else {
      return [
        { value: 'Oui', label: t('yes') },
        { value: 'Oui pour une durée modérée', label: t('yesModerateTime') },
        { value: 'Oui seulement si l\'équipe médicale le juge utile', label: t('yesMedicalTeam') },
        { value: 'Non rapidement abandonner le thérapeutique', label: t('noQuicklyAbandon') },
        { value: 'La non souffrance est à privilégier', label: t('prioritizeNoSuffering') },
        { value: 'Indécision', label: t('indecision') }
      ];
    }
  };

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t('lifeSupport')}
      description={t('advancedIllnessDesc')}
      onSubmit={handleSubmit}
      loading={loading}
      questionsLength={questions.length}
    >
      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          value={answers[question.id] || []}
          onValueChange={(value, checked) => handleAnswerChange(question.id, value, checked)}
          options={getQuestionOptions(question)}
        />
      ))}
    </QuestionsDialogLayout>
  );
}
