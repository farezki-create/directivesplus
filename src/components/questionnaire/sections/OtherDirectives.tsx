import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

interface OtherDirectivesProps {
  form: UseFormReturn<any>;
}

interface Question {
  id: string;
  question_text: string;
  category: string;
}

const fetchOtherDirectivesQuestions = async () => {
  console.log("Fetching other directives questions...");
  const { data, error } = await supabase
    .from('questionnaire_questions')
    .select('*')
    .eq('category', 'other_directives')
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
  
  // Remove duplicate questions based on question_text
  const uniqueQuestions = data?.reduce((acc: Question[], current) => {
    const exists = acc.find(item => item.question_text === current.question_text);
    if (!exists) {
      acc.push(current);
    }
    return acc;
  }, []);
  
  console.log("Fetched unique questions:", uniqueQuestions);
  return uniqueQuestions;
};

const updateQuestionsFromExcel = async () => {
  console.log("Updating questions from Excel...");
  const { data, error } = await supabase.functions.invoke('read-excel-questions');
  
  if (error) {
    console.error("Error updating questions:", error);
    throw error;
  }
  
  return data;
};

export const OtherDirectives = ({ form }: OtherDirectivesProps) => {
  const { toast } = useToast();
  const { data: questions, isLoading, error, refetch } = useQuery({
    queryKey: ['otherDirectivesQuestions'],
    queryFn: fetchOtherDirectivesQuestions,
  });

  const handleUpdateQuestions = async () => {
    try {
      await updateQuestionsFromExcel();
      await refetch();
      toast({
        title: "Succès",
        description: "Les questions ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error("Error updating questions:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour des questions.",
      });
    }
  };

  console.log("Component state:", { questions, isLoading, error });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    );
  }

  if (error) {
    console.error("Error in OtherDirectives component:", error);
    return (
      <div className="text-red-500">
        Une erreur est survenue lors du chargement des questions.
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="text-muted-foreground">
        Aucune question n'a été trouvée pour cette section.
        <Button
          onClick={handleUpdateQuestions}
          variant="outline"
          size="sm"
          className="ml-2"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Mettre à jour les questions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {questions.length} question{questions.length > 1 ? 's' : ''}
        </div>
        <Button
          onClick={handleUpdateQuestions}
          variant="outline"
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Mettre à jour
        </Button>
      </div>
      <div className="space-y-4">
        {questions.map((question) => (
          <FormField
            key={question.id}
            control={form.control}
            name={`medicalDirectives.otherDirectives.${question.id}`}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{question.question_text}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="true" />
                      </FormControl>
                      <FormLabel className="font-normal">Oui</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="false" />
                      </FormControl>
                      <FormLabel className="font-normal">Non</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};