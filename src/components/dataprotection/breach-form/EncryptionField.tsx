
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormSchema } from "./types";

interface EncryptionFieldProps {
  form: UseFormReturn<FormSchema>;
  onValueChange?: () => void;
}

export const EncryptionField: React.FC<EncryptionFieldProps> = ({ form, onValueChange }) => {
  return (
    <FormField
      control={form.control}
      name="is_data_encrypted"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                if (onValueChange) {
                  setTimeout(onValueChange, 0);
                }
              }}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              Les données concernées étaient correctement chiffrées
            </FormLabel>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
