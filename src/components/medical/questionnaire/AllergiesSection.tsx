
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

interface AllergiesSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function AllergiesSection({ control }: AllergiesSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
        5. Allergies
      </h2>
      <FormField
        control={control}
        name="allergies_medicaments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Médicaments</FormLabel>
            <FormControl>
              <Textarea placeholder="Listez vos allergies aux médicaments" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="allergies_aliments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Aliments</FormLabel>
            <FormControl>
              <Textarea placeholder="Listez vos allergies alimentaires" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="autres_allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Autres allergies</FormLabel>
            <FormControl>
              <Textarea placeholder="Mentionnez d'autres allergies (latex, insectes...)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
    </div>
  );
}
