import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "./questions/QuestionCard";
import { QuestionsDialogLayout } from "./questions/QuestionsDialogLayout";

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
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchQuestions() {
      try {
        console.log("Fetching advanced illness questions...");
        const { data, error } = await supabase
          .from('advanced_illness_questions')
          .select('*')
          .order('order', { ascending: true });
        
        if (error) {
          console.error('Error fetching questions:', error);
          return;
        }
        
        console.log('Raw data from advanced_illness_questions table:', data);
        // Sort questions by order if the data exists
        const sortedQuestions = data?.sort((a, b) => {
          // Handle null values in order column
          if (a.order === null) return 1;
          if (b.order === null) return -1;
          return a.order - b.order;
        }) || [];
        
        setQuestions(sortedQuestions);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    if (open) {
      fetchQuestions();
    }
  }, [open]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    console.log('Réponses soumises:', answers);
    onOpenChange(false);
  };

  const getQuestionOptions = (question: any) => [
    { 
      value: 'oui_medical', 
      label: question["Oui si l'équipe médicale le juge utile"]
    },
    { 
      value: 'oui_confiance', 
      label: question["Oui si ma personne de confiance le juge utile"]
    },
    { value: 'oui', label: question.oui },
    { value: 'non', label: question.non }
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
          value={answers[question.id] || ''}
          onValueChange={(value) => handleAnswerChange(question.id, value)}
          options={getQuestionOptions(question)}
        />
      ))}
    </QuestionsDialogLayout>
  );
}