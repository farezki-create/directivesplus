
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
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
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
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-6"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="oui" />
                  </FormControl>
                  <FormLabel className="font-normal">Oui</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="non" />
                  </FormControl>
                  <FormLabel className="font-normal">Non</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="alcool"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Consommation d'alcool ?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-6"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="oui" />
                  </FormControl>
                  <FormLabel className="font-normal">Oui</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="non" />
                  </FormControl>
                  <FormLabel className="font-normal">Non</FormLabel>
                </FormItem>
              </RadioGroup>
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
            <FormLabel>Consommation de drogues ?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-6"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="oui" />
                  </FormControl>
                  <FormLabel className="font-normal">Oui</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="non" />
                  </FormControl>
                  <FormLabel className="font-normal">Non</FormLabel>
                </FormItem>
              </RadioGroup>
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
            <FormLabel>Activité physique régulière ?</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex space-x-6"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="oui" />
                  </FormControl>
                  <FormLabel className="font-normal">Oui</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="non" />
                  </FormControl>
                  <FormLabel className="font-normal">Non</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator />
    </div>
  );
}
