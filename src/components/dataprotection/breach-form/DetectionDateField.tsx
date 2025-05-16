
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./types";

interface DetectionDateFieldProps {
  form: UseFormReturn<FormSchema>;
}

export const DetectionDateField: React.FC<DetectionDateFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="detection_date"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Date de détection</FormLabel>
          <FormControl>
            <Input 
              type="date" 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
