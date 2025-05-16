
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./types";

interface BreachTypeFieldProps {
  form: UseFormReturn<FormSchema>;
  onValueChange?: () => void;
}

export const BreachTypeField: React.FC<BreachTypeFieldProps> = ({ form, onValueChange }) => {
  return (
    <FormField
      control={form.control}
      name="breach_type"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Type de violation</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
            onOpenChange={onValueChange}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type de violation" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="confidentiality">Confidentialité (divulgation non autorisée)</SelectItem>
              <SelectItem value="integrity">Intégrité (altération non autorisée)</SelectItem>
              <SelectItem value="availability">Disponibilité (perte d'accès, destruction)</SelectItem>
              <SelectItem value="multiple">Multiple (plusieurs types)</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
