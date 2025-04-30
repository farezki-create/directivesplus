
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { MedicalQuestionnaireData } from "../schemas/medicalQuestionnaireSchema";
import { Checkbox } from "@/components/ui/checkbox";

interface SpecialFeaturesSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

/**
 * Special features section of the medical questionnaire form
 */
export function SpecialFeaturesSection({ control }: SpecialFeaturesSectionProps) {
  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-medium">Particularités</h3>
      
      <FormField
        control={control}
        name="dispositifs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dispositifs médicaux implantés</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Pacemaker, pompe à insuline, prothèse, etc."
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="directives"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Directives anticipées ou personne de confiance
              <a 
                href="https://www.directivesplus.fr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="ml-2 text-blue-600 hover:underline"
              >
                www.directivesplus.fr
              </a>
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Avez-vous rédigé des directives anticipées ou désigné une personne de confiance ?"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
