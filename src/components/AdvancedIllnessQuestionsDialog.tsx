import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";
import { useToast } from "@/hooks/use-toast";

interface AdvancedIllnessQuestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedIllnessQuestionsDialog({ 
  open, 
  onOpenChange 
}: AdvancedIllnessQuestionsDialogProps) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log("[AdvancedIllness] Fetching questions...");
        const { data, error } = await supabase
          .from('advanced_illness_questions')
          .select('*')
          .order('order', { ascending: true });
        
        if (error) {
          console.error('[AdvancedIllness] Error fetching questions:', error);
          toast({
            title: "Erreur",
            description: "Impossible de charger les questions. Veuillez réessayer.",
            variant: "destructive",
          });
          return;
        }
        
        console.log('[AdvancedIllness] Questions loaded:', data?.length, 'questions');
        const sortedQuestions = data?.sort((a, b) => {
          if (a.order === null) return 1;
          if (b.order === null) return -1;
          return a.order - b.order;
        }) || [];
        
        setQuestions(sortedQuestions);
      } catch (error) {
        console.error('[AdvancedIllness] Unexpected error:', error);
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
      fetchExistingAnswers();
    }
  }, [open, toast]);

  const fetchExistingAnswers = async () => {
    try {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      
      if (!userId) {
        console.log('[AdvancedIllness] No user ID found for fetching existing answers');
        return;
      }

      const { data, error } = await supabase
        .from('questionnaire_advanced_illness_responses')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('[AdvancedIllness] Error fetching existing answers:', error);
        return;
      }

      if (data) {
        const groupedAnswers: Record<string, string[]> = {};
        data.forEach(response => {
          if (!groupedAnswers[response.question_id]) {
            groupedAnswers[response.question_id] = [];
          }
          groupedAnswers[response.question_id].push(response.response);
        });
        console.log('[AdvancedIllness] Loaded existing answers:', groupedAnswers);
        setAnswers(groupedAnswers);
      }
    } catch (error) {
      console.error('[AdvancedIllness] Error in fetchExistingAnswers:', error);
    }
  };

  const handleAnswerChange = (questionId: string, value: string, checked: boolean) => {
    console.log('[AdvancedIllness] Answer change:', { questionId, value, checked });
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      if (checked) {
        return {
          ...prev,
          [questionId]: [...currentAnswers, value]
        };
      } else {
        return {
          ...prev,
          [questionId]: currentAnswers.filter(v => v !== value)
        };
      }
    });
  };

  const handleSubmit = async () => {
    try {
      console.log('[AdvancedIllness] Submitting answers:', answers);
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;

      if (!userId) {
        console.error('[AdvancedIllness] No user ID found');
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer vos réponses.",
          variant: "destructive",
        });
        return;
      }

      // First, delete existing responses for this user
      const { error: deleteError } = await supabase
        .from('questionnaire_advanced_illness_responses')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        console.error('[AdvancedIllness] Error deleting existing responses:', deleteError);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour vos réponses. Veuillez réessayer.",
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

      console.log('[AdvancedIllness] Prepared responses for insertion:', responses);

      if (responses.length === 0) {
        console.log('[AdvancedIllness] No responses to insert');
        toast({
          title: "Succès",
          description: "Vos réponses ont été enregistrées.",
        });
        onOpenChange(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('questionnaire_advanced_illness_responses')
        .insert(responses);

      if (insertError) {
        console.error('[AdvancedIllness] Error saving responses:', insertError);
        toast({
          title: "Erreur",
          description: "Impossible d'enregistrer vos réponses. Veuillez réessayer.",
          variant: "destructive",
        });
        return;
      }

      console.log('[AdvancedIllness] Responses saved successfully');
      toast({
        title: "Succès",
        description: "Vos réponses ont été enregistrées.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('[AdvancedIllness] Unexpected error during submission:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  const getQuestionOptions = (question: any) => [
    { value: 'oui', label: question.oui },
    { value: 'non', label: question.non },
    { 
      value: 'oui_medical', 
      label: question["Oui si l'équipe médicale le juge utile"]
    },
    { 
      value: 'oui_confiance', 
      label: question["Oui si ma personne de confiance le juge utile"]
    }
  ];

  return (
    <QuestionsDialogLayout
      open={open}
      onOpenChange={onOpenChange}
      title="Maladie avancée"
      description="Répondez aux questions suivantes concernant vos souhaits en cas de maladie avancée."
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
          multiple={true}
        />
      ))}
    </QuestionsDialogLayout>
  );
}