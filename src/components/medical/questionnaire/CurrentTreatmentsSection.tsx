
import React from "react";
import { Control } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";
import { VoiceRecorder } from "@/components/VoiceRecorder";

interface CurrentTreatmentsSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function CurrentTreatmentsSection({ control }: CurrentTreatmentsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md flex items-center justify-between">
        <span>6. Traitements actuels</span>
        <VoiceRecorder section="traitements" className="text-white" />
      </h2>
      
      <FormField
        control={control}
        name="traitements"
        render={({ field }) => (
          <FormItem className="border rounded-md p-4 relative">
            <FormLabel>Médicaments et traitements en cours</FormLabel>
            <div className="absolute top-4 right-4">
              <VoiceRecorder section="traitements-detail" />
            </div>
            <FormControl>
              <Textarea 
                placeholder="Liste de médicaments, dosage et fréquence" 
                className="min-h-[150px]" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
    </div>
  );
}
