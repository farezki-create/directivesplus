
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import { MedicalQuestionnaireData, dispositifsList } from "../schemas/medicalQuestionnaireSchema";
import { CheckboxGroup, CheckboxGroupItem } from "@/components/ui/checkbox-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VoiceRecorder } from "@/components/VoiceRecorder";

interface SpecialFeaturesSectionProps {
  control: Control<MedicalQuestionnaireData>;
}

/**
 * Special features section of the medical questionnaire form
 */
export function SpecialFeaturesSection({ control }: SpecialFeaturesSectionProps) {
  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h3 className="text-lg font-medium flex items-center justify-between">
        <span>Particularités</span>
        <VoiceRecorder section="particularites" />
      </h3>
      
      <FormField
        control={control}
        name="dispositifs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dispositifs médicaux implantés</FormLabel>
            <FormControl>
              <ScrollArea className="h-60 border rounded-md p-2">
                <CheckboxGroup 
                  value={field.value ? field.value.split(',') : []}
                  onValueChange={(value) => field.onChange(value.join(','))}
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
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="directives"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Directives anticipées et personne de confiance
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
                placeholder="Avez-vous désigné une personne de confiance ?"
                {...field}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
