
import React from "react";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Plus, X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormData } from "../hooks/useMedicalForm";

interface MedicationsListProps {
  form: UseFormReturn<FormData>;
  fields: any[];
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function MedicationsList({
  form,
  fields,
  onAdd,
  onRemove
}: MedicationsListProps) {
  return (
    <div>
      <FormLabel>Médicaments</FormLabel>
      <div className="space-y-3 mt-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex flex-col md:flex-row gap-2">
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
              onClick={() => onRemove(index)}
              disabled={fields.length <= 1}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={onAdd}
      >
        <Plus className="h-4 w-4 mr-1" />
        Ajouter un médicament
      </Button>
    </div>
  );
}
