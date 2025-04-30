
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

interface SpecialFeaturesSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function SpecialFeaturesSection({ control }: SpecialFeaturesSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
        10. Particularités
      </h2>
      <FormField
        control={control}
        name="dispositifs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dispositifs médicaux implantés</FormLabel>
            <FormControl>
              <Textarea placeholder="Pacemaker, prothèses, etc." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="directives"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Directives anticipées ou personne de confiance</FormLabel>
            <FormControl>
              <Textarea placeholder="Précisez vos directives ou personne de confiance" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
