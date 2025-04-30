
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";

interface ConsultationReasonSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function ConsultationReasonSection({ control }: ConsultationReasonSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
        2. Motif de consultation
      </h2>
      <div className="grid grid-cols-1 gap-4">
        <FormField
          control={control}
          name="motif"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motif principal</FormLabel>
              <FormControl>
                <Textarea placeholder="Décrivez le motif principal de votre consultation" {...field} />
              </FormControl>
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
                <Input placeholder="Quand les symptômes ont-ils commencé?" {...field} />
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
              <FormLabel>Évolution</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="-- Choisir --" />
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
