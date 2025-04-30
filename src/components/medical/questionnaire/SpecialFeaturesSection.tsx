
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
import { CheckboxGroup } from "@/components/ui/checkbox-group";
import { MedicalQuestionnaireData, dispositifsList } from "../schemas/medicalQuestionnaireSchema";
import { ExternalLink } from "lucide-react";

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
          <FormItem>
            <FormLabel>Dispositifs médicaux implantables</FormLabel>
            <FormControl>
              <CheckboxGroup
                options={dispositifsList}
                selected={field.value || []}
                onChange={field.onChange}
              />
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
            <FormLabel>Directives anticipées</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Avez-vous rédigé des directives anticipées?" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="py-2">
        <a 
          href="https://www.directivesplus.fr" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <span>Désigner ma personne de confiance</span> 
          <ExternalLink size={14} />
        </a>
      </div>
      
      <Separator />
    </div>
  );
}
