
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./types";

interface RiskLevelFieldProps {
  form: UseFormReturn<FormSchema>;
  onValueChange?: () => void;
}

export const RiskLevelField: React.FC<RiskLevelFieldProps> = ({ form, onValueChange }) => {
  return (
    <FormField
      control={form.control}
      name="risk_level"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Niveau de risque</FormLabel>
          <Select 
            onValueChange={(value) => {
              field.onChange(value);
              if (onValueChange) {
                setTimeout(onValueChange, 0);
              }
            }} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un niveau de risque" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="low">Faible</SelectItem>
              <SelectItem value="medium">Moyen</SelectItem>
              <SelectItem value="high">Élevé</SelectItem>
              <SelectItem value="critical">Critique</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
