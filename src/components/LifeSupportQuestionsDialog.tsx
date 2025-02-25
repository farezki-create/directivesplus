
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
  const { t } = useLanguage();

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
        .from('