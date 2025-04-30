
import React from "react";
import { Control } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";

interface SymptomsSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function SymptomsSection({ control }: SymptomsSectionProps) {
  const symptomOptions = [
    { id: "fièvre", label: "Fièvre" },
    { id: "douleur", label: "Douleur" },
    { id: "essoufflement", label: "Essoufflement" },
    { id: "toux", label: "Toux" },
    { id: "nausees", label: "Nausées / Vomissements" },
    { id: "diarrhee", label: "Diarrhée" },
    { id: "malaise", label: "Malaise / Perte de connaissance" },
    { id: "troubles_neuro", label: "Troubles neurologiques" },
    { id: "saignement", label: "Saignement" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
        3. Symptômes associés
      </h2>
      <FormField
        control={control}
        name="symptomes"
        render={() => (
          <FormItem>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {symptomOptions.map((option) => (
                <FormField
                  key={option.id}
                  control={control}
                  name="symptomes"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={option.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value || [], option.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== option.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {option.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="autres_symptomes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Autres symptômes</FormLabel>
            <FormControl>
              <Textarea placeholder="Décrivez d'autres symptômes non listés ci-dessus" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
    </div>
  );
}
