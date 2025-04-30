
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
import { MedicalQuestionnaireData, dispositifsList } from "../schemas/medicalQuestionnaireSchema";
import { CheckboxGroup, CheckboxGroupItem } from "@/components/ui/checkbox-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SpecialFeaturesSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function SpecialFeaturesSection({ control }: SpecialFeaturesSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
        9. Particularités
      </h2>
      
      <FormField
        control={control}
        name="dispositifs"
        render={({ field }) => (
          <FormItem className="border rounded-md p-4 space-y-4">
            <FormLabel className="text-base font-semibold">Dispositifs médicaux implantés</FormLabel>
            <FormControl>
              <ScrollArea className="h-60 border rounded-md p-2">
                <CheckboxGroup 
                  value={field.value || []}
                  onValueChange={field.onChange}
                  className="space-y-2"
                >
                  {dispositifsList.map((dispositif) => (
                    <div key={dispositif} className="flex items-start space-x-2">
                      <CheckboxGroupItem value={dispositif} id={`dispositif-${dispositif}`} />
                      <Label htmlFor={`dispositif-${dispositif}`} className="text-sm leading-tight">
                        {dispositif}
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
        name="directives"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Directives anticipées ou personne de confiance</FormLabel>
            <FormControl>
              <Textarea placeholder="Précisez vos directives ou personne de confiance" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
    </div>
  );
}
