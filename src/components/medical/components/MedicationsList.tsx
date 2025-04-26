
import React from "react";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { MedicationFormFields } from "./MedicationFormFields";
import { FormData } from "../schemas/medicalFormSchema";

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
          <MedicationFormFields
            key={field.id}
            form={form}
            index={index}
            onRemove={() => onRemove(index)}
            canRemove={fields.length > 1}
          />
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
