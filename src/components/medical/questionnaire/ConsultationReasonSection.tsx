
import React from "react";
import { Control } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MedicalQuestionnaireData, motifsList } from "../schemas/medicalQuestionnaireSchema";
import { VoiceRecorder } from "@/components/VoiceRecorder";

interface ConsultationReasonSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function ConsultationReasonSection({ control }: ConsultationReasonSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md flex items-center justify-between">
        <span>2. Motif de consultation</span>
        <VoiceRecorder section="motif-consultation" className="text-white" />
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="motif"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motif principal</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {motifsList.map((motif) => (
                    <SelectItem key={motif} value={motif}>
                      {motif}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="debut_symptomes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Début des symptômes</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="evolution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Evolution</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="aggravation">Aggravation</SelectItem>
                  <SelectItem value="amelioration">Amélioration</SelectItem>
                  <SelectItem value="stable">Stable</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <Separator />
    </div>
  );
}
