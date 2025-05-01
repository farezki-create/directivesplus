
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
import { VoiceRecorder } from "@/components/VoiceRecorder";

interface FamilyHistorySectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function FamilyHistorySection({ control }: FamilyHistorySectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md flex items-center justify-between">
        <span>7. Antécédents familiaux</span>
        <VoiceRecorder section="antecedents-familiaux" className="text-white" />
      </h2>
      
      <FormField
        control={control}
        name="famille"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maladies dans la famille</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Maladies présentes dans votre famille (parents, frères, sœurs, grands-parents)" 
                className="min-h-[150px]"
                value={field.value?.join('\n') || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value ? value.split('\n').filter(line => line.trim()) : []);
                }}
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
