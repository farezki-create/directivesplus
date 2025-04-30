
import React from "react";
import { Control } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";
import { ExternalLink } from "lucide-react";

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
      <div className="py-2">
        <a 
          href="https://www.directivesplus.fr" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <span>Rédiger mes directives anticipées</span> 
          <ExternalLink size={14} />
        </a>
      </div>
      <Separator />
    </div>
  );
}
