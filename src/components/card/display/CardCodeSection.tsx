
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
  if (!includeDirective && !includeMedical) {
    return (
      <div className="text-center py-2">
        <p className="text-xs text-white/70">Aucun code sélectionné</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white/10 rounded-md py-2 px-3 mb-2">
      {includeDirective && directiveCode && (
        <div className="mb-1">
          <p className="text-xs text-white/70">Code directives anticipées</p>
          <p className="text-lg font-bold tracking-wider">{directiveCode}</p>
        </div>
      )}
      
      {includeMedical && medicalCode && (
        <div>
          <p className="text-xs text-white/70">Code données médicales</p>
          <p className="text-lg font-bold tracking-wider">{medicalCode}</p>
        </div>
      )}
    </div>
  );
};

export default CardCodeSection;
