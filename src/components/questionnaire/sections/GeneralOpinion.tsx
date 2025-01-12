import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Database } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";

type Question = Database['public']['Tables']['questionnaire_questions']['Row'];

interface GeneralOpinionProps {
  form: UseFormReturn<any>;
}

const fetchGeneralOpinionQuestions = async () => {
  console.log("Fetching general opinion questions...");
  const { data, error } = await supabase
    .from('questionnaire_questions')
    .select('*')
    .eq('category', 'general_opinion')
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error("Error fetching general opinion questions:", error);
    throw error;
  }
  
  console.log("Fetched general opinion questions:", data);
  return data as Question[];
};

export const GeneralOpinion = ({ form }: GeneralOpinionProps) => {
  const { toast } = useToast();
  const { data: questions, isLoading, error, refetch } = useQuery({
    queryKey: ['generalOpinionQuestions'],
    queryFn: fetchGeneralOpinionQuestions,
  });

  console.log("Component state:", { questions, isLoading, error });

  const handleUpdateQuestions = async () => {
    try {
      const { error } = await supabase.functions.invoke('read-csv-questions');
      
      if (error) throw error;
      
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
    console.error("Error in GeneralOpinion component:", error);
    return (
      <div className="text-red-500">
        Une erreur est survenue lors du chargement des questions.
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    console.log("No questions found");
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground">
          Aucune question n'a été trouvée pour cette section.
        </div>
        <Button 
          onClick={handleUpdateQuestions}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Mettre à jour les questions
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button 
          onClick={handleUpdateQuestions}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Mettre à jour les questions
        </Button>
      </div>

      <div className="space-y-4">
        {questions?.map((question) => (
          <FormField
            key={question.id}
            control={form.control}
            name={`medicalDirectives.generalOpinion.${question.id}`}
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