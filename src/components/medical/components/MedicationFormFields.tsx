
import React from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { X } from "lucide-react";
import { FormData } from "../schemas/medicalFormSchema";

interface MedicationFormFieldsProps {
  form: UseFormReturn<FormData>;
  index: number;
  onRemove: () => void;
  canRemove: boolean;
}

export function MedicationFormFields({
  form,
  index,
  onRemove,
  canRemove
}: MedicationFormFieldsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2">
      <FormField
        control={form.control}
        name={`medications.${index}.name`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input {...field} placeholder="Nom du médicament" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`medications.${index}.dosage`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input {...field} placeholder="Dosage" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`medications.${index}.frequency`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input {...field} placeholder="Fréquence" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 mt-0"
        onClick={onRemove}
        disabled={!canRemove}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
