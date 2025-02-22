
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log("[LifeSupport] Fetching questions...");
        const { data, error } = await supabase
          .from('life_support_questions')
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
        const sortedQuestions = data?.sort((a, b) => {
          if (a.display_order === null) return 1;
          if (b.display_order === null) return -1;
          return a.display_order - b.display_order;
        }) || [];
        
        setQuestions(sortedQuestions);
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
    } else {
      setLoading(true);
      setQuestions([]);
    }
  }, [open, toast]);

  const handleAnswerChange = (questionId: string, value: string) => {
    console.log('[LifeSupport] Answer change:', { questionId, value });
    setAnswers(prev => ({
      ...prev,
      [questionId]: [value]
    }));
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

  const getQuestionOptions = (question: any) => [
    { value: 'indecision', label: question.Indécision },
    { value: 'oui', label: question.Oui },
    { 
      value: 'oui_duree_moderee', 
      label: question["Oui pour une durée modérée"]
    },
    { 
      value: 'oui_medical', 
      label: question["Oui seulement si l'équipe médicale le juge utile"]
    },
    { 
      value: 'non_abandonner', 
      label: question["Non rapidement abandonner le thérapeutique"]
    },
    { 
      value: 'non_souffrance', 
      label: question["La non souffrance est à privilégier"]
    }
  ];

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Maintien en vie, que pensez-vous:"
      onSubmit={handleSubmit}
      loading={loading}
      questionsLength={questions.length}
    >
      <div className="mb-4 text-lg font-bold">
        Que pensez-vous de :
      </div>
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
