
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./types";

interface UsersCountFieldProps {
  form: UseFormReturn<FormSchema>;
}

export const UsersCountField: React.FC<UsersCountFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="affected_users_count"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Nombre approximatif de personnes concernées</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              placeholder="Ex: 100" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
