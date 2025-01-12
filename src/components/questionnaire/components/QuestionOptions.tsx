import { FormItem, FormControl, FormLabel } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Database } from "@/integrations/supabase/types";

type Question = Database['public']['Tables']['questionnaire_questions']['Row'];

interface QuestionOptionProps {
  question: Question;
  field: any;
}

export const QuestionOptions = ({ question, field }: QuestionOptionProps) => {
  return (
    <RadioGroup
      onValueChange={field.onChange}
      defaultValue={field.value}
      className="flex flex-col space-y-1"
    >
      {question.indecision && (
        <FormItem className="flex items-center space-x-3 space-y-0">
          <FormControl>
            <RadioGroupItem value="indecision" />
          </FormControl>
          <FormLabel className="font-normal">Indécision</FormLabel>
        </FormItem>
      )}
      {question.plutot_oui && (
        <FormItem className="flex items-center space-x-3 space-y-0">
          <FormControl>
            <RadioGroupItem value="plutot_oui" />
          </FormControl>
          <FormLabel className="font-normal">Plutôt oui</FormLabel>
        </FormItem>
      )}
      {question.plutot_oui_duree_moderee && (
        <FormItem className="flex items-center space-x-3 space-y-0">
          <FormControl>
            <RadioGroupItem value="plutot_oui_duree_moderee" />
          </FormControl>
          <FormLabel className="font-normal">
            Plutôt oui, pour une durée modérée
          </FormLabel>
        </FormItem>
      )}
      {question.oui_si_equipe_medicale && (
        <FormItem className="flex items-center space-x-3 space-y-0">
          <FormControl>
            <RadioGroupItem value="oui_si_equipe_medicale" />
          </FormControl>
          <FormLabel className="font-normal">
            Oui, si l'équipe médicale le juge utile
          </FormLabel>
        </FormItem>
      )}
      {question.plutot_non_rapidement && (
        <FormItem className="flex items-center space-x-3 space-y-0">
          <FormControl>
            <RadioGroupItem value="plutot_non_rapidement" />
          </FormControl>
          <FormLabel className="font-normal">
            Plutôt non, rapidement
          </FormLabel>
        </FormItem>
      )}
      {question.non_sauf_equipe_medicale && (
        <FormItem className="flex items-center space-x-3 space-y-0">
          <FormControl>
            <RadioGroupItem value="non_sauf_equipe_medicale" />
          </FormControl>
          <FormLabel className="font-normal">
            Non, sauf si l'équipe médicale le juge utile
          </FormLabel>
        </FormItem>
      )}
      {question.plutot_non_non_souffrance && (
        <FormItem className="flex items-center space-x-3 space-y-0">
          <FormControl>
            <RadioGroupItem value="plutot_non_non_souffrance" />
          </FormControl>
          <FormLabel className="font-normal">
            Plutôt non, privilégier la non souffrance
          </FormLabel>
        </FormItem>
      )}
    </RadioGroup>
  );
};