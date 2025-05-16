
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./types";

interface ReporterFieldsProps {
  form: UseFormReturn<FormSchema>;
}

export const ReporterFields: React.FC<ReporterFieldsProps> = ({ form }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={form.control}
        name="reporter_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Votre nom</FormLabel>
            <FormControl>
              <Input 
                placeholder="Prénom et nom" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="reporter_email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Votre email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="email@exemple.com" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
