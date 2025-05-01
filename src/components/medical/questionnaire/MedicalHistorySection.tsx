
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
import { MedicalQuestionnaireData, pathologiesList, chirurgiesList } from "../schemas/medicalQuestionnaireSchema";
import { CheckboxGroup, CheckboxGroupItem } from "@/components/ui/checkbox-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VoiceRecorder } from "@/components/VoiceRecorder";

interface MedicalHistorySectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function MedicalHistorySection({ control }: MedicalHistorySectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md flex items-center justify-between">
        <span>4. Antécédents médicaux</span>
        <VoiceRecorder section="antecedents-medicaux" className="text-white" />
      </h2>
      
      <FormField
        control={control}
        name="pathologies"
        render={({ field }) => (
          <FormItem className="border rounded-md p-4 space-y-4">
            <FormLabel className="text-base font-semibold">Pathologies chroniques</FormLabel>
            <FormControl>
              <ScrollArea className="h-60 border rounded-md p-2">
                <CheckboxGroup 
                  value={field.value || []}
                  onValueChange={field.onChange}
                  className="space-y-2"
                >
                  {pathologiesList.map((pathologie) => (
                    <div key={pathologie} className="flex items-start space-x-2">
                      <CheckboxGroupItem value={pathologie} id={`pathologie-${pathologie}`} />
                      <Label htmlFor={`pathologie-${pathologie}`} className="text-sm leading-tight">
                        {pathologie}
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
        name="antecedents"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Autres antécédents médicaux</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Autres antécédents médicaux" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="chirurgies"
        render={({ field }) => (
          <FormItem className="border rounded-md p-4 space-y-4">
            <FormLabel className="text-base font-semibold">Chirurgies</FormLabel>
            <FormControl>
              <ScrollArea className="h-60 border rounded-md p-2">
                <CheckboxGroup 
                  value={field.value || []}
                  onValueChange={field.onChange}
                  className="space-y-2"
                >
                  {chirurgiesList.map((chirurgie) => (
                    <div key={chirurgie} className="flex items-start space-x-2">
                      <CheckboxGroupItem value={chirurgie} id={`chirurgie-${chirurgie}`} />
                      <Label htmlFor={`chirurgie-${chirurgie}`} className="text-sm leading-tight">
                        {chirurgie}
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
        name="autres_chirurgies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Autres chirurgies</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Autres chirurgies non listées" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="hospitalisations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hospitalisations</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Hospitalisations précédentes" 
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
