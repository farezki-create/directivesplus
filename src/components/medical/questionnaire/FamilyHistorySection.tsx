
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
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";

interface FamilyHistorySectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function FamilyHistorySection({ control }: FamilyHistorySectionProps) {
  const familyOptions = [
    { id: "cardiaque", label: "Maladie cardiaque" },
    { id: "cancer", label: "Cancer" },
    { id: "diabete", label: "Diabète" },
    { id: "hta", label: "Hypertension" },
    { id: "avc", label: "AVC" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
        7. Antécédents familiaux
      </h2>
      <FormField
        control={control}
        name="famille"
        render={() => (
          <FormItem>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {familyOptions.map((option) => (
                <FormField
                  key={option.id}
                  control={control}
                  name="famille"
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
      <Separator />
    </div>
  );
}
