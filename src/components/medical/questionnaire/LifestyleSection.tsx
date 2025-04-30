
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";

interface LifestyleSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function LifestyleSection({ control }: LifestyleSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
        8. Mode de vie
      </h2>
      <FormField
        control={control}
        name="tabac"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fumeur ?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="--" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="non">Non</SelectItem>
                <SelectItem value="oui">Oui</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="alcool"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alcool</FormLabel>
            <FormControl>
              <Textarea placeholder="Décrivez votre consommation d'alcool" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="drogues"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Drogues</FormLabel>
            <FormControl>
              <Textarea placeholder="Décrivez votre consommation de drogues" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="activite_physique"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Activité physique</FormLabel>
            <FormControl>
              <Textarea placeholder="Décrivez votre activité physique" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
    </div>
  );
}
