
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

interface SymptomsSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function SymptomsSection({ control }: SymptomsSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md flex items-center justify-between">
        <span>3. Symptômes</span>
        <VoiceRecorder section="symptomes" className="text-white" />
      </h2>
      
      <FormField
        control={control}
        name="symptomes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Symptômes principaux</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Décrivez vos symptômes principaux"
                className="min-h-[100px]"
                value={field.value?.join(', ') || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value ? value.split(',').map(s => s.trim()) : []);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="autres_symptomes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Autres symptômes ou précisions</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Autres symptômes ou précisions" 
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
