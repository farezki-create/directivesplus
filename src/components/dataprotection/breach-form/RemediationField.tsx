
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./types";

interface RemediationFieldProps {
  form: UseFormReturn<FormSchema>;
}

export const RemediationField: React.FC<RemediationFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="remediation_measures"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mesures de remédiation prises ou prévues</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Décrivez les mesures prises pour limiter l'impact de la violation..." 
              className="min-h-[100px]"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
