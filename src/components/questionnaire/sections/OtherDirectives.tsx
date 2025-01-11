import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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
    .eq('category', 'general_opinion')
    .order('created_at', { ascending: true });
    
  if (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
  
  console.log("Fetched questions:", data);
  return data as Question[];
};

export const OtherDirectives = ({ form }: OtherDirectivesProps) => {
  const { data: questions, isLoading, error } = useQuery({
    queryKey: ['otherDirectivesQuestions'],
    queryFn: fetchOtherDirectivesQuestions,
  });

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

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Autres directives</h3>
        
        {questions?.map((question) => (
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