
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
import { MedicalQuestionnaireData, allergiesList } from "../schemas/medicalQuestionnaireSchema";
import { CheckboxGroup, CheckboxGroupItem } from "@/components/ui/checkbox-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VoiceRecorder } from "@/components/VoiceRecorder";

interface AllergiesSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function AllergiesSection({ control }: AllergiesSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md flex items-center justify-between">
        <span>5. Allergies</span>
        <VoiceRecorder section="allergies" className="text-white" />
      </h2>
      
      <FormField
        control={control}
        name="allergies"
        render={({ field }) => (
          <FormItem className="border rounded-md p-4 space-y-4">
            <FormLabel className="text-base font-semibold">Types d'allergies</FormLabel>
            <FormControl>
              <ScrollArea className="h-60 border rounded-md p-2">
                <CheckboxGroup 
                  value={field.value || []}
                  onValueChange={field.onChange}
                  className="space-y-2"
                >
                  {allergiesList.map((allergie) => (
                    <div key={allergie} className="flex items-start space-x-2">
                      <CheckboxGroupItem value={allergie} id={`allergie-${allergie}`} />
                      <Label htmlFor={`allergie-${allergie}`} className="text-sm leading-tight">
                        {allergie}
                      </Label>
                    </div>
                  ))}
                </CheckboxGroup>
              </ScrollArea>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
    </div>
  );
}
