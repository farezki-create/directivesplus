
import React from "react";
import { Control } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MedicalQuestionnaireData, pathologiesList, chirurgiesList } from "../schemas/medicalQuestionnaireSchema";

interface MedicalHistorySectionProps {
  control: Control<MedicalQuestionnaireData>;
}

export function MedicalHistorySection({ control }: MedicalHistorySectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold py-2 px-4 bg-blue-500 text-white rounded-md">
        4. Antécédents médicaux
      </h2>
      
      <FormField
        control={control}
        name="pathologies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pathologies connues</FormLabel>
            <FormDescription>
              Sélectionnez toutes les pathologies qui vous concernent
            </FormDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {pathologiesList.map((pathologie) => (
                <FormField
                  key={pathologie}
                  control={control}
                  name="pathologies"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={pathologie}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(pathologie)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), pathologie])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== pathologie
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {pathologie}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="antecedents"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Autres pathologies non listées</FormLabel>
            <FormControl>
              <Textarea placeholder="Précisez vos autres pathologies ou antécédents médicaux" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="chirurgies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chirurgies antérieures</FormLabel>
            <FormDescription>
              Sélectionnez toutes les chirurgies que vous avez subies
            </FormDescription>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {chirurgiesList.map((chirurgie) => (
                <FormField
                  key={chirurgie}
                  control={control}
                  name="chirurgies"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={chirurgie}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(chirurgie)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), chirurgie])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== chirurgie
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {chirurgie}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="autres_chirurgies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Autres chirurgies non listées</FormLabel>
            <FormControl>
              <Textarea placeholder="Précisez vos autres chirurgies non listées ci-dessus" {...field} />
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
            <FormLabel>Hospitalisations récentes</FormLabel>
            <FormControl>
              <Textarea placeholder="Mentionnez vos hospitalisations récentes" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
    </div>
  );
}
