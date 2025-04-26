
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Plus, X } from "lucide-react";

interface ConditionsListProps {
  conditions: string[];
  newCondition: string;
  onNewConditionChange: (value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

export function ConditionsList({
  conditions,
  newCondition,
  onNewConditionChange,
  onAdd,
  onRemove
}: ConditionsListProps) {
  return (
    <div>
      <FormLabel>Conditions médicales</FormLabel>
      <div className="flex mt-2 mb-1">
        <Input 
          value={newCondition} 
          onChange={(e) => onNewConditionChange(e.target.value)} 
          placeholder="Ajouter une condition médicale"
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
        {conditions.map((condition, index) => (
          <div 
            key={index} 
            className="bg-slate-100 px-2 py-1 rounded-md flex items-center text-sm"
          >
            {condition}
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
