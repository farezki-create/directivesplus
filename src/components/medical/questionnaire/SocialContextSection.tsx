
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";

interface SocialContextSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function SocialContextSection({ control }: SocialContextSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
        9. Contexte social
      </h2>
      <FormField
        control={control}
        name="vie_seul"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vie seul(e) ?</FormLabel>
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
        name="profession"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Profession</FormLabel>
            <FormControl>
              <Input placeholder="Votre profession" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="couverture"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Couverture sociale</FormLabel>
            <FormControl>
              <Input placeholder="Détails sur votre couverture sociale" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
    </div>
  );
}
