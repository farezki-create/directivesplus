
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
    <div className="space-y-1.5 mb-1">
      {includeDirective && (
        <div className="flex items-center gap-2 bg-white/20 rounded p-1.5">
          <FileText size={16} className="shrink-0" />
          <div>
            <p className="text-xs font-semibold">Directives anticipées:</p>
            <p className="font-mono font-bold tracking-wider text-sm">
              {directiveCode || "Générez le code"}
            </p>
          </div>
        </div>
      )}
      
      {includeMedical && (
        <div className="flex items-center gap-2 bg-white/20 rounded p-1.5">
          <Activity size={16} className="shrink-0" />
          <div>
            <p className="text-xs font-semibold">Données médicales:</p>
            <p className="font-mono font-bold tracking-wider text-sm">
              {medicalCode || "Générez le code"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardCodeSection;
