import { FormField, FormItem, FormLabel } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Skeleton } from "@/components/ui/skeleton";
import { UpdateQuestionsButton } from "../components/UpdateQuestionsButton";
import { QuestionOptions } from "../components/QuestionOptions";
import { useQuestionnaireQuestions } from "@/hooks/useQuestionnaireQuestions";

interface PainReliefProps {
  form: UseFormReturn<any>;
}

export const PainRelief = ({ form }: PainReliefProps) => {
  const { 
    data: questions, 
    isLoading, 
    error,
    refetch 
  } = useQuestionnaireQuestions('pain_relief');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>
    );
  }

  if (error) {
    console.error("Error in PainRelief component:", error);
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
        <UpdateQuestionsButton onUpdate={async () => { await refetch(); }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Allégement des souffrances</h3>
        <UpdateQuestionsButton onUpdate={async () => { await refetch(); }} />
      </div>

      <div className="space-y-4">
        {questions.map((question) => (
          <FormField
            key={question.id}
            control={form.control}
            name={`medicalDirectives.painRelief.${question.id}`}
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{question.question_text}</FormLabel>
                <QuestionOptions question={question} field={field} />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};