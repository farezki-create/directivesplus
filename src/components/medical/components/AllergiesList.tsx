
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Plus, X } from "lucide-react";

interface AllergiesListProps {
  allergies: string[];
  newAllergy: string;
  onNewAllergyChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function AllergiesList({
  allergies,
  newAllergy,
  onNewAllergyChange,
  onAdd,
  onRemove
}: AllergiesListProps) {
  return (
    <div>
      <FormLabel>Allergies</FormLabel>
      <div className="flex mt-2 mb-1">
        <Input 
          value={newAllergy} 
          onChange={(e) => onNewAllergyChange(e.target.value)} 
          placeholder="Ajouter une allergie"
          className="mr-2"
        />
        <Button 
          type="button" 
          variant="outline" 
          onClick={onAdd}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-2">
        {allergies.map((allergy, index) => (
          <div 
            key={index} 
            className="bg-slate-100 px-2 py-1 rounded-md flex items-center text-sm"
          >
            {allergy}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 ml-1"
              onClick={() => onRemove(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
