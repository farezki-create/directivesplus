
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { FormSchema, dataTypeOptions } from "./types";

interface AffectedDataFieldProps {
  form: UseFormReturn<FormSchema>;
  onValueChange?: () => void;
}

export const AffectedDataField: React.FC<AffectedDataFieldProps> = ({ form, onValueChange }) => {
  return (
    <FormField
      control={form.control}
      name="affected_data_types"
      render={() => (
        <FormItem>
          <div className="mb-2">
            <FormLabel>Types de données concernées</FormLabel>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {dataTypeOptions.map((option) => (
              <FormField
                key={option.id}
                control={form.control}
                name="affected_data_types"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={option.id}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.id)}
                          onCheckedChange={(checked) => {
                            const updatedValue = checked
                              ? [...field.value, option.id]
                              : field.value?.filter(
                                  (value) => value !== option.id
                                );
                            field.onChange(updatedValue);
                            if (onValueChange) {
                              setTimeout(onValueChange, 0);
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {option.label}
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
  );
};
