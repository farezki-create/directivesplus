
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

interface CardOptionsProps {
  includeDirective: boolean;
  setIncludeDirective: (checked: boolean) => void;
  includeMedical: boolean;
  setIncludeMedical: (checked: boolean) => void;
}

const CardOptions: React.FC<CardOptionsProps> = ({
  includeDirective,
  setIncludeDirective,
  includeMedical,
  setIncludeMedical
}) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Options de la carte</h2>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="directive"
            checked={includeDirective} 
            onCheckedChange={(checked) => setIncludeDirective(checked === true)}
          />
          <label 
            htmlFor="directive"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Inclure le code pour les directives anticipées
          </label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="medical"
            checked={includeMedical} 
            onCheckedChange={(checked) => setIncludeMedical(checked === true)}
          />
          <label 
            htmlFor="medical"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Inclure le code pour les données médicales
          </label>
        </div>
        
        {!includeDirective && !includeMedical && (
          <p className="text-red-500 text-sm mt-2">Veuillez sélectionner au moins un type de code à inclure</p>
        )}
      </div>
    </div>
  );
};

export default CardOptions;
