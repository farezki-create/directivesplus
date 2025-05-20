
import React from "react";
import { FileText, Activity } from "lucide-react";

interface CardCodeSectionProps {
  includeDirective: boolean;
  includeMedical: boolean;
  directiveCode?: string | null;
  medicalCode?: string | null;
}

const CardCodeSection: React.FC<CardCodeSectionProps> = ({ 
  includeDirective, 
  includeMedical, 
  directiveCode, 
  medicalCode 
}) => {
  return (
    <div className="space-y-2 mb-2">
      {includeDirective && (
        <div className="flex items-center gap-2 bg-white/20 rounded p-2">
          <FileText size={24} className="shrink-0 text-white" />
          <div>
            <p className="text-xs font-semibold">Directives anticipées:</p>
            <p className="font-mono font-bold tracking-wider text-lg">
              {directiveCode || "En attente..."}
            </p>
          </div>
        </div>
      )}
      
      {includeMedical && (
        <div className="flex items-center gap-2 bg-white/20 rounded p-2">
          <Activity size={24} className="shrink-0 text-white" />
          <div>
            <p className="text-xs font-semibold">Données médicales:</p>
            <p className="font-mono font-bold tracking-wider text-lg">
              {medicalCode || "En attente..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardCodeSection;
