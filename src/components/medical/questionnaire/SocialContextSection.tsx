
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";

interface SocialContextSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

/**
 * Social context section of the medical questionnaire
 * Note: This component is currently not used in the main form
 */
export function SocialContextSection({ control }: SocialContextSectionProps) {
  const livingOptions = [
    { value: "seul", label: "Seul(e)" },
    { value: "famille", label: "En famille" },
    { value: "couple", label: "En couple" },
    { value: "autre", label: "Autre" }
  ];

  const insuranceOptions = [
    { value: "securite_sociale", label: "Sécurité sociale" },
    { value: "mutuelle", label: "Mutuelle complémentaire" },
    { value: "ame", label: "AME" },
    { value: "cmu", label: "CMU" },
    { value: "aucune", label: "Aucune" }
  ];

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-medium">Contexte social</h3>
      
      <FormField
        control={control}
        name="contexte_social.vie" // Using nested object
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mode de vie</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {livingOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="contexte_social.profession" // Using nested object
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profession</FormLabel>
            <FormControl>
              <Input placeholder="Profession actuelle" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="contexte_social.couverture" // Using nested object
        render={({ field }) => (
          <FormItem>
            <FormLabel>Couverture sociale</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {insuranceOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
}
