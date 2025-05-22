
import React from "react";

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
    <div className="grid grid-cols-2 gap-2 w-full mb-2 text-center">
      {includeDirective && (
        <div className="flex flex-col items-center">
          <span className="text-xs mb-1 text-white/80">Code directives</span>
          <span className="font-mono bg-white/20 rounded px-1 py-0.5 text-sm font-bold">
            {directiveCode || '---'}
          </span>
        </div>
      )}
      
      {includeMedical && (
        <div className="flex flex-col items-center">
          <span className="text-xs mb-1 text-white/80">Code médical</span>
          <span className="font-mono bg-white/20 rounded px-1 py-0.5 text-sm font-bold">
            {medicalCode || '---'}
          </span>
        </div>
      )}
    </div>
  );
};

export default CardCodeSection;
