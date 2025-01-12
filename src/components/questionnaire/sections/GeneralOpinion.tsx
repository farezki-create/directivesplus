import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdateQuestionsButton } from "../components/UpdateQuestionsButton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuestionnaireQuestions } from "@/hooks/useQuestionnaireQuestions";

interface GeneralOpinionProps {
  form: UseFormReturn<any>;
}

export const GeneralOpinion = ({ form }: GeneralOpinionProps) => {
  const { 
    data: questions, 
    isLoading, 
    error, 
    refetch 
  } = useQuestionnaireQuestions('general_opinion');

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
    return (
      <div className="space-y-4">
        <div className="text-muted-foreground">
          Aucune question n'a été trouvée pour cette section.
        </div>
        <UpdateQuestionsButton onUpdate={refetch} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <UpdateQuestionsButton onUpdate={refetch} />
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <FormField
            key={question.id}
            control={form.control}
            name={`medicalDirectives.generalOpinion.${question.id}`}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{question.question_text}</FormLabel>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  {question.oui && (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value="oui" />
                      <FormLabel className="font-normal">Oui</FormLabel>
                    </FormItem>
                  )}
                  {question.non && (
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <RadioGroupItem value="non" />
                      <FormLabel className="font-normal">Non</FormLabel>
                    </FormItem>
                  )}
                </RadioGroup>
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};