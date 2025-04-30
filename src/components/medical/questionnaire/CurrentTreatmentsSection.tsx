
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
import { Textarea } from "@/components/ui/textarea";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";

interface CurrentTreatmentsSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function CurrentTreatmentsSection({ control }: CurrentTreatmentsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
        6. Traitements en cours
      </h2>
      <FormField
        control={control}
        name="traitements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Médicaments habituels</FormLabel>
            <FormControl>
              <Textarea placeholder="Listez vos médicaments habituels" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="modif_traitements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Modifications récentes</FormLabel>
            <FormControl>
              <Textarea placeholder="Indiquez les modifications récentes de traitement" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
    </div>
  );
}
