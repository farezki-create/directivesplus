
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

interface MedicalHistorySectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function MedicalHistorySection({ control }: MedicalHistorySectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
        4. Antécédents médicaux
      </h2>
      <FormField
        control={control}
        name="antecedents"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pathologies connues</FormLabel>
            <FormControl>
              <Textarea placeholder="Listez vos pathologies connues" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="chirurgies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chirurgies antérieures</FormLabel>
            <FormControl>
              <Textarea placeholder="Décrivez vos précédentes chirurgies" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="hospitalisations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hospitalisations récentes</FormLabel>
            <FormControl>
              <Textarea placeholder="Mentionnez vos hospitalisations récentes" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
    </div>
  );
}
