
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
import { MedicalQuestionnaireData, allergiesList } from "../schemas/medicalQuestionnaireSchema";
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { CheckboxGroupItem } from "@/components/ui/checkbox-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AllergiesSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function AllergiesSection({ control }: AllergiesSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
        5. Allergies
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
      
      <FormField
        control={control}
        name="allergies_medicaments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Autres allergies médicamenteuses</FormLabel>
            <FormControl>
              <Textarea placeholder="Autres allergies aux médicaments non listées ci-dessus" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="allergies_aliments"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Autres allergies alimentaires</FormLabel>
            <FormControl>
              <Textarea placeholder="Autres allergies alimentaires non listées ci-dessus" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="autres_allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Autres allergies</FormLabel>
            <FormControl>
              <Textarea placeholder="Autres types d'allergies non listées ci-dessus" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
    </div>
  );
}
